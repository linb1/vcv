import { Router } from "express";
import { getNodesAndComments } from "../controllers/nodeAndCommentController";

const router = Router();

router.get("/", getNodesAndComments);

export default router;
