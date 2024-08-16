import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNodesAndComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nodes = await prisma.nodes.findMany();
    const comments = await prisma.comments.findMany();

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

    // Attach comments to nodes
    comments.forEach((comment) => {
      if (nodeMap[comment.tag]) {
        nodeMap[comment.tag].attributes.comment = comment.text;
      }
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
    res.status(500).json({ message: "Error retrieving nodes and comments" });
  }
};
