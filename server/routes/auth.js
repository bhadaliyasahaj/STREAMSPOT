import express from "express";
import { getCode, handleForgotPassword, handleResetPassword, signin } from "../controllers/auth.controller.js";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

//Create a User
router.post("/signup", signup);

//Sign In
router.post("/signin", signin);

//Get Verification Code
router.post("/getcode", getCode);

//Handle Forgot Password
router.post("/forgotpass", handleForgotPassword)

//Handle Reset Password
router.post("/resetpassword",handleResetPassword)

export default router;
