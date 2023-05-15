import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";

//interface created to validate the
//structure type that should be used to signup a User

interface SignUpUserBody {
  name: string;
  email: string;
  user: string;
  password: string;
  picturePath: string;
}

function validateBody(body: Record<string, string>) {
  const errors: Record<string, string> = {};

  if (!body.name || typeof body.name !== "string") {
    errors.name = "Falta el nombre.";
  }

  if (!body.email || typeof body.email !== "string") {
    errors.email = "Falta el correo.";
  }

  if (!body.user || typeof body.user !== "string") {
    errors.user = "Falta el usuario.";
  }

  if (!body.password || typeof body.password !== "string") {
    errors.password = "Falta el contraseña.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  Record<string, string>,
  unknown
> = async (req, res, next) => {  
  const validation = validateBody(req.body);
  if (!validation.isValid) {
    return res.json({ validation });
  }

  const input = req.body as unknown as SignUpUserBody;

  
  try {
    const existingUser = await userModel.findOne({ user: input.user });
    if (existingUser) {
      throw createHttpError(409, "Username already taken.");
    }

    const existingEmail = await userModel.findOne({ email: input.email });
    if (existingEmail) {
      throw createHttpError(409, "Email already taken");
    }

    const hashedPassword = await bcrypt.hash(input.password, 13);

    // creates the model for the new user
    const newUser = await userModel.create({
      name: input.name,
      email: input.email,
      user: input.user,
      password: hashedPassword,
      picturePath: input.picturePath,
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
  const userId = req.body.user;
  const password = req.body.password;

  try {
    if (!userId || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await userModel
      .findOne({ user: userId })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};
