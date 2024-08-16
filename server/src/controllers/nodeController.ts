import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const nodes = await prisma.nodes.findMany();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving nodes" });
  }
};
