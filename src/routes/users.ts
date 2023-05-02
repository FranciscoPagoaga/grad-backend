import express from "express";
import * as UsersController from "../controllers/users";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/:userId", verifyToken, UsersController.getUser);

// router.get("/:userId/following", verifyToken, )

// router.patch("/:userId", UsersController.followUser);

export default router;