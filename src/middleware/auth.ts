import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import config from "../config";

export const verifyToken: RequestHandler = async (req, res, next) =>{
    try {
        let token = req.header("Authorization");
        if (!token){
            throw createHttpError(403, "Access Denied");
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, config.JWT_SECRET);
        req.body.user = verified;
        next();
    } catch (error) {
        next(error);
    }
}