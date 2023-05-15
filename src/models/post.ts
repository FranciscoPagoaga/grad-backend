import { InferSchemaType, model, Schema } from "mongoose";

// const commentSchema = new Schema(
//   {
//     commentId: { type: Number, unique: true },
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     content: { type: String, required: true },
//     enabled: { type: Boolean, required: true },
//     picturePath: {type: String, required: true},
//   },
//   { timestamps: true }
// );

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    user: {type: String, required: true},
    content: { type: String, required: true },
    comments: {type: Array, default:[]},
    likes: { type: Map, of: Boolean },
    picturePath: { type: String, required: false },
    userPicturePath: { type: String },
    watchtime: { type: Map, of: Number },
    enabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>("Post", postSchema);
