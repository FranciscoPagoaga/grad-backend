import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { create } from "domain";

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
      id: user?.id,
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
      id: user?.id,
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
      console.log("Entra");
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
      id: user?.id,
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
  const newName = req.body.name;
  const newBiography = req.body.biography;
  const newPicturePath = req.body.picturePath

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    if (!newName) {
      throw createHttpError(400, "User must have a name");
    }

    if (!newPicturePath) {
      throw createHttpError(400, "User must have a picturePath");
    }

    if (!newBiography) {
      throw createHttpError(400, "User must have a biography");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name: newName,
        picturePath: newPicturePath,
        biography: newBiography,
      },
      { new: true }
    );

    if(!updatedUser){
      throw createHttpError(404, "User not found");
    }

    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      user: updatedUser.user,
      biography: updatedUser.biography,
      picturePath: updatedUser.picturePath,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    next(error);
  }
};
