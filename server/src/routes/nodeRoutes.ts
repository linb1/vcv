import { Router } from "express";
import { getNodes } from "../controllers/nodeController";

const router = Router();

router.get("/", getNodes);

export default router;
