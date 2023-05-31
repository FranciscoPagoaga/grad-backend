import { RequestHandler } from "express";
import userModel from "../models/user";
import postModel from "../models/post";
import commentModel from "../models/comment";
import createHttpError from "http-errors";
import mongoose from "mongoose";

/* Read Functions */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await userModel.findById(userId).exec();

    //verifies if the user exists instead of throwing null
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByName: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findOne({ user: userId }).exec();
    //verifies if the user exists instead of throwing null
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowing: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const following = await Promise.all(
      user.following.map((id) => userModel.findById(id))
    );

    const formattedFollowing = following.map((user) => ({
      _id: user?._id,
      name: user?.name,
      user: user?.user,
      biography: user?.biography,
      picturePath: user?.picturePath,
    }));

    res.status(200).json(formattedFollowing);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowers: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const followers = await Promise.all(
      user.followers.map((id) => userModel.findById(id))
    );

    const formattedFollowers = followers.map((user) => ({
      _id: user?.id,
      name: user?.name,
      user: user?.user,
      biography: user?.biography,
      picturePath: user?.picturePath,
    }));

    res.status(200).json(formattedFollowers);
  } catch (error) {
    next(error);
  }
};

/* Update Functions */

interface followRequestBody {
  id: string;
  followingId: string;
}

export const handleFollowing: RequestHandler<
  followRequestBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const followingId = req.params.followingId;
    const user = await userModel.findById(userId);
    const userFollows = await userModel.findById(followingId);

    if (!user || !userFollows) {
      throw createHttpError(404, "User not found");
    }

    if (user.following.includes(new mongoose.Types.ObjectId(followingId))) {
      user.following = user.following.filter(
        (id) => id.toString() !== followingId
      );
      userFollows.followers = userFollows.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      user.following.push(new mongoose.Types.ObjectId(followingId));
      userFollows.followers.push(new mongoose.Types.ObjectId(userId));
    }
    await user.save();
    await userFollows.save();

    const following = await Promise.all(
      user.following.map((id) => userModel.findById(id))
    );

    const formattedFollowing = following.map((user) => ({
      _id: user?.id,
      name: user?.name,
      user: user?.user,
      biography: user?.biography,
      picturePath: user?.picturePath,
    }));

    res.status(200).json(formattedFollowing);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const name = req.body.name;
  const biography = req.body.biography;
  const picturePath = req.body.picturePath;
  const phoneNumber = req.body.phoneNumber;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        picturePath,
        biography,
        phoneNumber
      },
      { new: true }
    );

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    await postModel
      .updateMany({ userId }, { name, userPicturePath: picturePath })
      .exec();

    await commentModel
      .updateMany({ userId }, { name, userPicturePath: picturePath })
      .exec();

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const searchBySimilarity: RequestHandler = async (req, res, next) => {
  const user = req.params.user;
  try {
    const regex = new RegExp(user, "i");
    const query = userModel.find();
    query.or([{ user: regex }, { name: regex }]);

    const results = await query.exec();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
