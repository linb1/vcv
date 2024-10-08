import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Gets all comments
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

// Get all comments associated with a specific node
export const getCommentsByNodeId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nodeId } = req.params;
  try {
    const comments = await prisma.comments.findMany({
      where: {
        tag: nodeId,
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments from node" });
  }
};

// Creates a comment
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tag, text } = req.body;
    const comment = await prisma.comments.create({
      data: {
        tag,
        text,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment" });
  }
};

// Updates a comment
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedComment = await prisma.comments.update({
      where: { id: parseInt(id, 10) },
      data: { text },
    });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment" });
  }
};
