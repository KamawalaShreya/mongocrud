import express from "express";
import AuthController from "./auth.controller";
import asyncHandler from "express-async-handler";
import storeFiles from "../common/middlewares/storeFile";
import authenticateUser from "../common/middlewares/authenticateUser";
import registerUserDto from "./dtos/register-user.dto";
import loginUserDto from "./dtos/login-user.dto";
import validator from "../common/config/joi-validator";
const router = express.Router();

router.post("/register", 
    storeFiles("media/profileImages", "profileImage", "single"),
    validator.body(registerUserDto),
    asyncHandler(AuthController.register));

router.post("/verify-otp", asyncHandler(AuthController.verifyOtp));

router.post("/resend-otp", asyncHandler(AuthController.resendOtp));

router.post("/login", 
    validator.body(loginUserDto),
    asyncHandler(AuthController.login));

module.exports = router;
