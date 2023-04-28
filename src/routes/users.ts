import express from "express";
import * as UsersController from "../controllers/users";

const router = express.Router();

router.get("/", UsersController.getUsers);

router.get("/:userId", UsersController.getUser);

router.post("/signup", UsersController.signUp);

router.post("/login", UsersController.login);

router.patch("/:userId", UsersController.updateUser);

export default router;