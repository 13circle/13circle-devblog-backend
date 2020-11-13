import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
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
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },
});

const Comment = model("Comment", CommentSchema);

export default Comment;

