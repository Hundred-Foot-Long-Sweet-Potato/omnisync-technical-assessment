// app/api/cards/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cards = await prisma.card.findMany();
    return new Response(JSON.stringify(cards), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch cards" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { mainNumber} = await req.json();
    const newCard = await prisma.card.create({
      data: { mainNumber, numberOfClicks : 0, timeOfFirstClick : null },
    });
    return new Response(JSON.stringify(newCard), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create card" }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { mainNumber, numberOfClicks, timeOfFirstClick } = await req.json();
    const updatedCard = await prisma.card.update({
      where: { mainNumber },
      data: { numberOfClicks, timeOfFirstClick },
    });
    return new Response(JSON.stringify(updatedCard), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update card" }), { status: 500 });
  }
}
