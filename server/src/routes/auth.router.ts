import express from "express";
import {userRegister, userLogin, userLogout} from "../controllers/auth.controller";
import { verifyToken } from "../utils/createToken";
const router = express.Router();

router.post("/signin", userRegister);
router.post("/login", userLogin);
router.post("/logout",verifyToken, userLogout);

export default router;