import { Router } from "express";
import {
  getNodes,
  createNode,
  deleteNode,
} from "../controllers/nodeController";

const router = Router();

router.get("/", getNodes);
router.post("/", createNode);
router.delete("/:id", deleteNode);

export default router;
