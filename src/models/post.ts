import { InferSchemaType, model, Schema } from "mongoose";

const watchtimeSchema = new Schema(
    {
        userid: {type: Schema.Types.ObjectId, ref: "User", required: true},
        watchtime: {type: Number, required: true}
    }
)

const commentSchema = new Schema(
    {
        commentId: {type: Number, unique: true},
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        enabled: { type: Boolean, required: true },
    },
    {timestamps: true}
)

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    comments: [commentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    watchtime: [watchtimeSchema],
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>

export default model<Post>("Post", postSchema)