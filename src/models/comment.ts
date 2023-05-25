import { InferSchemaType, model, Schema } from "mongoose";


const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    name: { type: String, required: true },
    user: {type: String, required: true},
    content: { type: String, required: true },
    userPicturePath: { type: String },
    enabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

type Comment = InferSchemaType<typeof commentSchema>;

export default model<Comment>("Comment", commentSchema);