import express from "express";
import * as UsersController from "../controllers/users";
import { verifyToken } from "../middleware/auth";

const router = express.Router();
//poner de vuelta funcion verify token de middleware una vez se implemente el token en sesion
router.patch("/:id/:followingId", UsersController.handleFollowing);

router.get("/search/:user", verifyToken, UsersController.searchBySimilarity);

router.get("/:userId", verifyToken, UsersController.getUser);

router.get("/:userId/user", verifyToken, UsersController.getUserByName);

router.get("/:userId/following", verifyToken,  UsersController.getUserFollowing);

router.get("/:userId/followers", verifyToken, UsersController.getUserFollowers);

export default router;