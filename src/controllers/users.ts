import { RequestHandler } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";

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
        
        //verifies if the user exists instead of throwing null
        if(!user){
            throw createHttpError(404, "User not found")
        }
        
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

//interface created to validate the 
//structure type that should be used to create a User
interface CreateUserBody {
    name?: string,
    email?: string,
    user?: string,
    password?: string,
    biography?: string,
    profilephoto?: string,
}


export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const user = req.body.user;
    const password = req.body.password;
    const biography = req.body.biography;
    const profilephoto = req.body.profilephoto;
    
    try {
        // ifs to validate if all the needed params
        // are found in the package to create a user
        // if one's not found, throws error 
        if(!name){
            throw createHttpError(400, "User must have a name");
        } else if(!email){
            throw createHttpError(400, "User must have a email");
        } else if(!user){
            throw createHttpError(400, "User must have a username");
        } else if(!password){
            throw createHttpError(400, "User must have a password");
        } else if(!biography){
            throw createHttpError(400, "User must have a biography");
        } else if(!profilephoto){
            throw createHttpError(400, "User must have a profilephoto");
        }
        
        // creates the model for the new user
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