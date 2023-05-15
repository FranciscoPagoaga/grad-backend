import express from "express";
import * as PostsController from "../controllers/posts";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/* Read */
router.get("/:userId/feed", verifyToken, PostsController.getFeedPosts);
router.get("/:userId", verifyToken, PostsController.getUserPosts);

/* Update */
router.patch("/:id/like", verifyToken, PostsController.likePost);
// router.patch("/:postId", PostsController.);

export default router;