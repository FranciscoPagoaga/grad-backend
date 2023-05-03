import express from "express";
import * as UsersController from "../controllers/users";
import { verifyToken } from "../middleware/auth";

const router = express.Router();
//poner de vuelta funcion verify token de middleware una vez se implemente el token en sesion

router.get("/:userId", verifyToken, UsersController.getUser);

router.get("/:userId/following", UsersController.getUserFollowing);

router.get("/:userId/followers", UsersController.getUserFollowers);

router.patch("/:id/:followingId",  UsersController.handleFollowing);

export default router;