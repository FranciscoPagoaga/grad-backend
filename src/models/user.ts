import { InferSchemaType, model,  Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    following: {type: Array, default: []},
    followers: {type: Array, default:[]},
    biography: { type: String, default: "" },
    picturePath: { type: String, default: "" }, 
    enabled: { type: Boolean, default: true }
},{timestamps: true});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);