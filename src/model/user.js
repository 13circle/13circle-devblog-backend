import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BCRYPT_SALT_ROUNDS = 10;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    privilege: {
      type: String,
      enum: ["SysAdmin", "Admin", "User"],
      default: "User",
      required: true,
    },
    myPosts: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      required: true,
    },
    likedPosts: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
      required: true,
    },
    favoredTags: {
      type: [Schema.Types.ObjectId],
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updatedAt: "updatedAt",
    },
  },
);

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.password;
  return data;
};

UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  this.password = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const User = model("User", UserSchema);

export default User;
