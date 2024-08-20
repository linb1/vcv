import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Gets nodes and formats data to work with D3 Tree
export const getNodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const nodes = await prisma.nodes.findMany();

    // Create a map to hold nodes by their ID
    const nodeMap: Record<string, any> = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = {
        name: node.name,
        attributes: {
          id: node.id.toUpperCase(),
          path: node.path,
        },
        children: [],
      };
    });

    // Find the root node (node with no parent)
    let root: any = null;
    nodes.forEach((node) => {
      if (node.prev === null) {
        root = nodeMap[node.id];
      } else {
        if (nodeMap[node.prev]) {
          nodeMap[node.prev].children.push(nodeMap[node.id]);
        }
      }
    });

    res.json(root);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving nodes" });
  }
};

// Creates a node
export const createNode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { prev, name, path } = req.body;
    const product = await prisma.nodes.create({
      data: {
        prev,
        name,
        path,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating node" });
  }
};

// Deletes a node and all associated comments
export const deleteNode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // First, delete all comments associated with the node
    await prisma.comments.deleteMany({
      where: {
        tag: id,
      },
    });

    // Then, delete the node itself
    const deletedNode = await prisma.nodes.delete({
      where: { id },
    });

    res.json({
      message: "Node and associated comments deleted successfully",
      node: deletedNode,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting node and comments" });
  }
};
