import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register",singleUpload, register);
router.post("/login", login);
router.post("/logout", logout);

// Forget Password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
