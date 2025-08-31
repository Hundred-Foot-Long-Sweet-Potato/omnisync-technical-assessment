// app/api/cards/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Singleton pattern
const globalPrisma = globalThis as unknown as {
  prisma : PrismaClient | undefined;
};

const prisma = globalPrisma.prisma ?? new PrismaClient();


// Response types
interface CardPostRequest {
  mainNumber : number;
}

interface CardPutRequest {
  mainNumber : number;
  numberOfClicks: number;
  timeOfFirstClick: Date | null;
}

export async function GET() {
  try {
    const cards = await prisma.card.findMany({orderBy: {mainNumber: "asc"}});
    return NextResponse.json(cards, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body : CardPostRequest = await req.json();

    //Input validation
    if (!body.mainNumber || typeof body.mainNumber !== "number") {
      return NextResponse.json({error: "Valid mainNumber is required!"}, {status:400})
    }

    const newCard = await prisma.card.create({
      data: {
        mainNumber: body.mainNumber,
        numberOfClicks : 0,
         timeOfFirstClick : null
        },
    });

    return NextResponse.json(newCard, { status: 201 });

  } catch (error) {

    //Handle unique mainNumber violation
    if (error instanceof Error && error.message.includes("Unique constraint")){
      return NextResponse.json({error:"Card with this mainNumber already exists!"},{status:409})
    }

    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: CardPutRequest = await req.json();

    //Input validation
    if (!body.mainNumber || typeof body.mainNumber !== "number") {
      return NextResponse.json({ error: "Valid mainNumber is required" },{ status: 400 });
    }
    
    if (typeof body.numberOfClicks !== "number") {
      return NextResponse.json({ error: "Valid numberOfClicks is required" },{ status: 400 });
    }

    //Create card
    const updatedCard = await prisma.card.update({
      where: { mainNumber: body.mainNumber },
      data: { numberOfClicks: body.numberOfClicks, timeOfFirstClick: body.timeOfFirstClick },
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {

    //Handle not found (This is only possible if initial POST fails and user doesn't see error msg)
    if (error instanceof Error && error.message.includes("Record to update not found!")){
      return NextResponse.json({error:"Card not found!"},{status:404});
    }

    return new Response(JSON.stringify({ error: "Failed to update card" }), { status: 500 });
  }
}
