import express,{ Express } from "express";
import {generateChat} from "../controllers/chat.controller";
import { verifyToken } from "../utils/createToken";
const router = express.Router();

router.post("/chat",verifyToken, generateChat);

export default router;