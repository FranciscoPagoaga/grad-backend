import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";




//interface created to validate the
//structure type that should be used to signup a User

interface SignUpUserBody {
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
  SignUpUserBody,
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

  try {
    if (!user || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const foundUser = await userModel
      .findOne({ user: user })
      .select("+password +email")
      .exec();

    if (!foundUser) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const token = jwt.sign({ id: foundUser._id}, config.JWT_SECRET);

    res.status(201).json({ token, foundUser});
  } catch (error) {
    next(error);
  }
};
