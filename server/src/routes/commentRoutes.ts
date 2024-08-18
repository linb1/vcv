import { Router } from "express";
import {
  createComment,
  getComments,
  getCommentsByNodeId,
} from "../controllers/commentController";

const router = Router();

router.get("/", getComments);
router.get("/node/:nodeId", getCommentsByNodeId);
router.post("/", createComment);

export default router;
