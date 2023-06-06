import express from "express";
import asyncHandler from "express-async-handler";
import UserController from "./user.controller";
import authenticateUser from "../common/middlewares/authenticateUser";
import validator from "../common/config/joi-validator";
import resetPasswordDto from "./dtos/reset-password.dto";
const router = express.Router();


// router.post("/verify-otp", asyncHandler(AuthController.verifyOtp));
router.get("/", authenticateUser, asyncHandler(UserController.index));

router.post("/forgot-password", asyncHandler(UserController.forgotPassword));

router.post("/reset-password", 
    validator.body(resetPasswordDto),
    asyncHandler(UserController.resetPassword)
);


module.exports = router;