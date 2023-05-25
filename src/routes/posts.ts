import express from "express";
import * as PostsController from "../controllers/posts";
import * as CommentsController from "../controllers/comments";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/* Read */
router.get("/:userId/feed", verifyToken, PostsController.getFeedPosts);

router.get("/:userId", verifyToken, PostsController.getUserPosts);

/* Update */
router.patch("/:id/like", verifyToken, PostsController.likePost);

router.patch("/:id/watchtime", verifyToken, PostsController.addWatchtime);


/* Comment Routes */
/*Create*/
router.post("/comment", CommentsController.createComment);

/* Read */
router.get("/:postId/comments", CommentsController.getComments);
export default router;