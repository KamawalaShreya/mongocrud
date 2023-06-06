import express from "express";
import authRoutes from "../src/auth/auth.routes";
import userRoutes  from "../src/user/user.routes";
import authenticateUser from "../src/common/middlewares/authenticateUser";
import AuthController from "../src/auth/auth.controller";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.post(
    "/fcm/token",
    authenticateUser,
    // [authenticateUser, validator.body(storeFCMToken)],
    AuthController.addFcmToken
);

module.exports = router;
