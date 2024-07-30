import express,{ Express } from "express";
import {generateChat, getChats} from "../controllers/chat.controller";
import { verifyToken } from "../utils/createToken";
const router = express.Router();

router.post("/chat",verifyToken, generateChat);
router.get("/allchat",verifyToken, getChats);

export default router;