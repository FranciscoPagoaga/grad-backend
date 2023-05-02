import { InferSchemaType, model,  Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    following: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    biography: { type: String, required: false, default: "" },
    profilephoto: { type: String, required: false, default: "" }, 
    enable: { type: Boolean, required: true }
},{timestamps: true});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);