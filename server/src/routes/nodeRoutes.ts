import { Router } from "express";
import { getNodes, createNode } from "../controllers/nodeController";

const router = Router();

router.get("/", getNodes);
router.post("/", createNode);

export default router;
