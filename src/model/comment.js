import { model, Schema } from "mongoose";
import timezone from "mongoose-timezone";

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});

CommentSchema.plugin(timezone);

const Comment = model("Comment", CommentSchema);

export default Comment;

