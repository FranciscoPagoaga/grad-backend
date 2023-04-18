import { RequestHandler } from "express";
import userModel from "../models/user";

export const getUsers: RequestHandler = async (req, res, next) => {
    try{
        const users = await userModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId

    try {
        const user = await userModel.findById(userId).exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const createUser: RequestHandler = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const user = req.body.user;
    const password = req.body.password;
    const biography = req.body.biography;
    const profilephoto = req.body.profilephoto;
    
    try {
        const newUser = await userModel.create({
            name: name,
            email: email,
            user: user,
            password: password,
            biography: biography,
            profilephoto: profilephoto,
            enable: true
        })

        res.status(201).json(newUser);
    } catch (error) {
        next(error)   
    }
}