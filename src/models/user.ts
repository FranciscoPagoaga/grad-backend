import { InferSchemaType, model,  Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: String, required: true },
    password: { type: String, required: true },
    following: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    biography: { type: String, required: false },
    profilephoto: { type: String, required: false }, 
    enable: { type: Boolean, required: false }
},{timestamps: true});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);