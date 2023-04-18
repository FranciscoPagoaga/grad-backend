import { RequestHandler } from "express";
import postModel from "../models/post";

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
        const user = await postModel.findById(postId).exec();
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

export const createPost: RequestHandler = async(req, res, next) => {
    const userId = req.body.userId;
    const content = req.body.content;
    try {
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