import express from "express";
import * as PostsController from "../controllers/posts";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/* Read */
router.get("/", PostsController.getFeedPosts);
router.get("/:userId/posts", PostsController.getUserPosts);

router.post("/", PostsController.createPost);
/* Update */
router.patch("/:id/like", PostsController.likePost);
// router.patch("/:postId",PostsController.);

export default router;