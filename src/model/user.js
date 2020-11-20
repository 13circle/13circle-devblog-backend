import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

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

UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.password;
  return data;
};

UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  this.password = hash;
};

UserSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

export default User;

