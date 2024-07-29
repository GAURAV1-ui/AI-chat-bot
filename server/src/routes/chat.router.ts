import express,{ Express } from "express";
import {generateChat} from "../controllers/chat.controller";
const router = express.Router();

router.post("/chat", generateChat);

export default router;