import { InferSchemaType, model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    user: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Map, of: Boolean, default: new Map },
    picturePath: { type: String, default: "" },
    userPicturePath: { type: String },
    watchtime: { type: Map, of: Number, default: new Map },
    enabled: { type: Boolean, default: true },
    rating: { type: Map, of: Number, default: new Map },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>("Post", postSchema);
