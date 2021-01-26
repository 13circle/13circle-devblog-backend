import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import cryptoRandomString from "crypto-random-string";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const BCRYPT_SALT_ROUNDS = 10;

dotenv.config();

const {
  APP_DOMAIN,
  JWT_SECRET,
  MAIL_SENDER_SERVICE,
  MAIL_SENDER_HOST,
  MAIL_SENDER_PORT,
  OAUTH_USER,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
} = process.env;

if (!APP_DOMAIN) {
  throw Error("APP_DOMAIN does not exist");
}

if (!JWT_SECRET) {
  throw Error("JWT_SECRET does not exist");
}

["SERVICE", "HOST", "PORT"].forEach((v) => {
  if (!process.env[`MAIL_SENDER_${v}`]) {
    throw Error(`MAIL_SENDER_${v} does not exist`);
  }
});

["USER", "CLIENT_ID", "CLIENT_SECRET", "REFRESH_TOKEN"].forEach((v) => {
  if (!process.env[`OAUTH_${v}`]) {
    throw Error(`OAUTH_${v} does not exist`);
  }
});

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
  delete data.emailConfirmed;
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
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

UserSchema.methods.generateEmailToken = function () {
  this.emailToken = cryptoRandomString({ length: 32 });
};

UserSchema.methods.sendConfirmEmail = async function () {
  const transporter = nodemailer.createTransport({
    service: MAIL_SENDER_SERVICE,
    host: MAIL_SENDER_HOST,
    port: parseInt(MAIL_SENDER_PORT, 10),
    secure: true,
    auth: {
      type: "OAuth2",
      user: OAUTH_USER,
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: OAUTH_USER,
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
