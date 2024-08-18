import { Router } from "express";
import {
  getComments,
  getCommentsByNodeId,
} from "../controllers/commentController";

const router = Router();

router.get("/", getComments);
router.get("/node/:nodeId", getCommentsByNodeId);

export default router;
