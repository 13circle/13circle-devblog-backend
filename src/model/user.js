import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, unique: true, required: true },
  nickname: { type: String, unique: true, required: true },
  privilege: {
    type: String,
    enum: [ "SysAdmin", "Admin", "User" ],
    required: true,
  },
  likedPosts: {
    type: [ Schema.Types.ObjectId ],
    ref: "Post",
    required: true,
  },
  favoredTags: {
    type: [ Schema.Types.ObjectId ],
    ref: "Tag",
    required: true,
  },
}, {
  timestamps: {
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },
});

const User = model("User", UserSchema);

export default User;

