import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { create } from "domain";

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  try {
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

interface followingUserBody {
  _id: string;
  name: string;
  user: string;
  biography: string;
  profilephoto: string;
}

interface followingList {
  userId: string;
}

export const getUserFollowing: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
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
      profilephoto: user?.profilephoto,
    }));

    res.status(200).json(formattedFollowing);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowers: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
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
      profilephoto: user?.profilephoto,
    }));

    res.status(200).json(formattedFollowers);
  } catch (error) {
    next(error);
  }
};

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
    res.status(200).json("prueba");
  } catch (error) {
    next(error);
  }
};

interface UpdateUserParams {
  userId: string;
}

interface updateUserBody {
  name?: string;
  email?: string;
  user?: string;
  password?: string;
  biography?: string;
  profilephoto?: string;
  enable?: boolean;
}

export const updateUser: RequestHandler<
  UpdateUserParams,
  unknown,
  updateUserBody,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId;
  const newName = req.body.name;
  const newEmail = req.body.email;
  const newUser = req.body.user;
  const newPassword = req.body.password;
  const newBiography = req.body.biography;
  const newProfilephoto = req.body.profilephoto;
  const newEnable = req.body.enable;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    if (!newName) {
      throw createHttpError(400, "User must have a name");
    }

    if (!newUser) {
      throw createHttpError(400, "User must have a username");
    }

    if (!newEmail) {
      throw createHttpError(400, "User must have a email");
    }

    if (!newPassword) {
      throw createHttpError(400, "User must have a password");
    }

    if (!newProfilephoto) {
      throw createHttpError(400, "User must have a profilephoto");
    }

    if (!newEnable) {
      throw createHttpError(400, "User must have a state");
    }
    if (!newBiography) {
      throw createHttpError(400, "User must have a biography");
    }

    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    user.name = newName;
    user.user = newUser;
    user.email = newEmail;
    user.password = newPassword;
    user.profilephoto = newProfilephoto;
    user.enable = newEnable;
    user.biography = newBiography;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const disableUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user Id");
    }

    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};
