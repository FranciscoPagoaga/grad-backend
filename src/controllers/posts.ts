import { RequestHandler } from "express";
import postModel from "../models/post";
import userModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";

//interface created to validate the
//structure type that should be used to create a User
interface CreatePostBody {
  content: string;
  userId?: string;
  picturePath: string;
}

export const createPost: RequestHandler<
  unknown,
  unknown,
  Record<string, string>,
  unknown
> = async (req, res, next) => {
  try {
    const { userId, content, picturePath } =
      req.body as unknown as CreatePostBody;
    // ifs to validate if all the needed params
    // are found in the package to create a post
    // if one's not found, throws error
    if (!userId) {
      throw createHttpError(400, "Post must have a userId");
    }
    if (!content) {
      throw createHttpError(400, "Post must have content");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    await postModel.create({
      userId,
      name: user.name,
      user: user.user,
      content,
      enabled: true,
      comments: {},
      likes: {},
      picturePath,
      userPicturePath: user.picturePath,
      watchtime: {},
    });

    const post = await postModel.find().sort({ createdAt: -1 });
    console.log(post);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

/* Read */

export const getFeedPosts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      throw createHttpError(400, "Must send user id");
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const following = user.following;
    following.push(userId);
    const post = await postModel
      .find({ userId: following })
      .sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      throw createHttpError(400, "Must send user id");
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const posts = await postModel
      .find({ userId: userId, enabled: true })
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (!mongoose.isValidObjectId(postId)) {
      throw createHttpError(400, "Invalid post id");
    }

    const post = await postModel.findById(postId).exec();

    //verifies if the user exists instead of throwing null
    if (!post) {
      throw createHttpError(404, "Post not found");
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/* Update */

export const likePost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw createHttpError(400, "Must send user id");
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }
    const post = await postModel.findById(id);

    if (!post) {
      throw createHttpError(404, "Post not found");
    }

    const isLiked = post.likes?.get(userId);

    if (isLiked) {
      post.likes?.delete(userId);
    } else {
      post.likes?.set(userId, true);
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
