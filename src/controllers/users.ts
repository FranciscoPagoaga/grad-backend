import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { create } from "domain";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userModel.find().exec();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

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

//interface created to validate the
//structure type that should be used to create a User
interface CreateUserBody {
  name?: string;
  email?: string;
  user?: string;
  password?: string;
  biography?: string;
  profilephoto?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  CreateUserBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const user = req.body.user;
  const password = req.body.password;
  const profilephoto = req.body.profilephoto;

  try {
    // ifs to validate if all the needed params
    // are found in the package to create a user
    // if one's not found, throws error
    if (!name) {
      throw createHttpError(400, "User must have a name");
    }

    if (!email) {
      throw createHttpError(400, "User must have a email");
    }

    if (!user) {
      throw createHttpError(400, "User must have a username");
    }

    if (!password) {
      throw createHttpError(400, "User must have a password");
    }

    if (!profilephoto) {
      throw createHttpError(400, "User must have a profilephoto");
    }

    const existingUser = await userModel.findOne({ user: user });
    if (existingUser) {
      throw createHttpError(409, "Username already taken.");
    }

    const existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
      throw createHttpError(409, "Email already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 13);

    // creates the model for the new user
    const newUser = await userModel.create({
      name: name,
      email: email,
      user: user,
      password: hashedPassword,
      biography: "",
      profilephoto: profilephoto,
      enable: true,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  user?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
    const user = req.body.user;
    const password = req.body.password;

    try{
        if(!user || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const foundUser = await userModel.findOne({user: user}).select("+password +email").exec();

        if(!foundUser){
            throw createHttpError(401, "Invalid Credentials");
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);

        if(!passwordMatch) {
            throw createHttpError(401, "Invalid Credentials");
        }

        res.status(201).json(user);
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
