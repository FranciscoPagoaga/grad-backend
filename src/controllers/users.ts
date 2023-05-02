import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { create } from "domain";
import user from "../models/user";

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

interface followingUserBody{
  _id: string
  name: string
  user: string,
  biography: string,
  profilephoto: string,
}

export const getUserFollowing: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId);

  if(!user){
    throw createHttpError(404, "User not found");
  }

  const following  = await Promise.all(
    user.following.map((id) => userModel.findById(id))
  );
  
  // const formattedFollowing = following.map(({_id, name}) => {_id; name;})
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
