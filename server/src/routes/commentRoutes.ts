import { Router } from "express";
import {
  createComment,
  getComments,
  getCommentsByNodeId,
  updateComment,
} from "../controllers/commentController";

const router = Router();

router.get("/", getComments);
router.get("/node/:nodeId", getCommentsByNodeId);
router.post("/", createComment);
router.put("/:id", updateComment);

export default router;
