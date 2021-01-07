import Joi from "joi";
import jwt from "jsonwebtoken";

import User from "../../model/user";

export const check = async (ctx) => {
  const { authorization } = ctx.request.header;
  const token = authorization.split(" ")[1];

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(result.id);
    ctx.body = user.serialize();
  } catch(e) {
    ctx.throw(401, e);
  }
};

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
    name: Joi.string().required(),
    nickname: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password, name, nickname } = ctx.request.body;

  try {
    const isExists = {
      email: await User.findOne({ email }),
      nickname: await User.findOne({ nickname }),
    };

    if (isExists.email || isExists.nickname) {
      ctx.status = 409;
      return;
    }

    const user = new User({
      email,
      password,
      name,
      nickname,
      privilege: "User",
    });
    await user.setPassword(password);
    await user.save();

    // Alias of:
    // ctx.response.status = 200;
    // ctx.response.body = user;
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      ctx.status = 401;
      return;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      ctx.status = 401;
      return;
    }

    ctx.body = user.getToken();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const logout = async (ctx) => {
  ctx.body = "POST /api/users/logout";
};

export const edit = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
    newPassword: Joi.string().min(12).optional(),
    name: Joi.string().optional(),
    nickname: Joi.string().optional(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const reqBody = ctx.request.body;
  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 401;
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      ctx.status = 401;
      return;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      ctx.status = 401;
      return;
    }

    if (reqBody.newPassword) {
      await user.setPassword(reqBody.newPassword);
    }

    user.name = reqBody.name || user.name;
    user.nickname = reqBody.nickname || user.nickname;
    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unregister = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      ctx.status = 401;
      return;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      ctx.status = 401;
      return;
    }

    const nickname = user.toJSON().nickname;
    await user.deleteOne();

    ctx.body = `Bye, ${nickname}!`;
  } catch (e) {
    ctx.throw(500, e);
  }
};
