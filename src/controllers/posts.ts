import { RequestHandler } from "express";
import postModel from "../models/post";
import createHttpError from "http-errors";

export const getPosts: RequestHandler = async(req, res, next) =>{
    try {
        const users = await postModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}

export const getPost: RequestHandler = async(req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await postModel.findById(postId).exec();
        
        //verifies if the user exists instead of throwing null
        if(!post){
            throw createHttpError(404, "Post not found");
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}

//interface created to validate the 
//structure type that should be used to create a User
interface CreatePostBody{
    userId?: string
    content: string 
}

export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async(req, res, next) => {
    const userId = req.body.userId;
    const content = req.body.content;
    try {
        // ifs to validate if all the needed params
        // are found in the package to create a post
        // if one's not found, throws error 
        if(!userId){
            throw createHttpError(400, "Post must have a userId");
        } else if(!content){
            throw createHttpError(400, "Post must have content");
        }

        const newPost = await postModel.create({
            userId: userId,
            content: content,
            enabled: true,
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error)
    }
}