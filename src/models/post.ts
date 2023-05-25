import { InferSchemaType, model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    user: {type: String, required: true},
    content: { type: String, required: true },
    likes: { type: Map, of: Boolean },
    picturePath: { type: String, required: false },
    userPicturePath: { type: String },
    watchtime: { type: Map, of: Number, default: Map },
    enabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>("Post", postSchema);