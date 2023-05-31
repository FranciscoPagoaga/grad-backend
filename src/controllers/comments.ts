import { RequestHandler } from "express";
import postModel from "../models/post";
import userModel from "../models/user";
import commentModel from "../models/comment";
import createHttpError from "http-errors";

interface CreateCommentBody {
  userId: string;
  postId: string;
  content: string;
}

export const createComment: RequestHandler<
  unknown,
  unknown,
  CreateCommentBody,
  unknown
> = async (req, res, next) => {
  try {
    const { userId, postId, content } = req.body;
    // ifs to validate if all the needed params
    // are found in the package to create a post
    // if one's not found, throws error
    if (!userId) {
      throw createHttpError(400, "Comment must have a userId");
    }
    if (!content) {
      throw createHttpError(400, "Comment must have content");
    }
    if (!postId) {
      throw createHttpError(400, "Comment must have postId");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const comment = await commentModel.create({
      userId,
      postId,
      name: user.name,
      user: user.user,
      content,
      userPicturePath: user.picturePath,
      enabled: true,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

interface getCommentsParams {
  postId: string;
}

export const getComments: RequestHandler<
  getCommentsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await commentModel
      .find({ postId })
      .sort({ createdAt: -1 });

    res.status(201).json(comments);
  } catch (error) {
    next(error);
  }
};