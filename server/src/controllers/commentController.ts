import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await prisma.comments.findMany();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments" });
  }
};
