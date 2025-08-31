import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     switch (req.method) {
        case 'GET':
            try {
                const cards = await prisma.card.findMany();
                return res.status(200).json(cards);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch cards" });
            }
            break;
        case 'POST':
            {
                const { mainNumber, numberOfClicks, timeOfFirstClick } = req.body;
                const newCard = await prisma.card.create({
                    data: { mainNumber, numberOfClicks, timeOfFirstClick }});
                return res.status(201).json(newCard);
            }
        case 'PUT':
            try {
            const {mainNumber, numberOfClicks, timeOfFirstClick} = req.body;

            const updatedCard = await prisma.card.update({
                where: { mainNumber: mainNumber },
                data: {numberOfClicks, timeOfFirstClick},
            });
            return res.status(200).json(updatedCard);
        } catch (error) {
            res.status(500).json({ error: "Failed to update card" });
        }
        default:
            res.status(405).json({ error: "Method not allowed" });
    }
}
