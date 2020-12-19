import { model, Schema } from "mongoose";

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: {
    type: [ Schema.Types.ObjectId ],
    ref: "Tag",
    required: true,
  },
  title: { type: String, unique: true, required: true },
  content: { type: String, requried: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
}, {
  timestamps: {
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },
});

const Post = model("Post", PostSchema);

export default Post;

