import express from "express";
import * as PostsController from "../controllers/posts";

const router = express.Router();

router.get("/", PostsController.getPosts);

router.get("/:postId", PostsController.getPost);

router.post("/",PostsController.createPost);

export default router;