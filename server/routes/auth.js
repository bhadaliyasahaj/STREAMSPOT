import express from "express";
import { getCode, signin } from "../controllers/auth.controller.js";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

//Create a User
router.post("/signup", signup);

//Sign In
router.post("/signin", signin);

//Get Verification Code
router.post("/getcode", getCode);

export default router;
