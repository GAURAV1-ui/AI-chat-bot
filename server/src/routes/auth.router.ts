import express,{ Express } from "express";
import {userRegister, userLogin} from "../controllers/auth.controller";
const router = express.Router();

router.post("/signin", userRegister);
router.post("/login", userLogin);
export default router;