import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import cryptoRandomString from "crypto-random-string";

const BCRYPT_SALT_ROUNDS = 10;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    emailConfirmed: { type: Boolean, default: false, required: true },
    emailToken: String,
    privilege: {
      type: String,
      enum: ["SysAdmin", "Admin", "User"],
      default: "User",
      required: true,
    },
    myPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    ],
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    ],
    favoredTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
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
  delete data.emailToken;
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

UserSchema.methods.generateEmailToken = function () {
  this.emailToken = cryptoRandomString({ length: 32 });
};

UserSchema.methods.sendConfirmEmail = async function () {
  const { SENDGRID_SECRET, MAILER_EMAIL, APP_DOMAIN } = process.env;

  try {
    sgMail.setApiKey(SENDGRID_SECRET);

    await sgMail.send({
      from: MAILER_EMAIL,
      to: `${this.nickname} <${this.email}>`,
      subject: `[13circle DevBlog] Confirm your email!`,
      html: `
        <h1>Hi, ${this.nickname}!</h1>
        <hr />
        <br />
        <p>Welcome to 13circle DevBlog!</p>
        <p>Please click the button below to confirm your email:</p>
        <br />
        <div style="text-align: center">
          <a href="${APP_DOMAIN}/api/users/confirm-email/${this._id}/${this.emailToken}">
            <input type="button" value="Confirm" style="border:none; padding:1.5em; font-weight:bold; color:#ffffff; background-color:#4770e7">
          </a>
        </div>
        <br />
        <hr />
        <br />
        <p>Please ignore this email if you didn't request this email.</p>
      `,
    });
  } catch (e) {
    console.error(e);

    if (e.response) {
      console.error(e.response.body);
    }
  }
};

const User = model("User", UserSchema);

export default User;
