import { model, Schema } from "mongoose";
import timezone from "mongoose-timezone";

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    title: { type: String, unique: true, required: true },
    content: { type: String, requried: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

PostSchema.methods.getBriefContent = function (maxContentLen) {
  return this.content.length < maxContentLen ? this.content : `${this.content.slice(0, maxContentLen)}...`;
};

PostSchema.plugin(timezone);

const Post = model("Post", PostSchema);

export default Post;
