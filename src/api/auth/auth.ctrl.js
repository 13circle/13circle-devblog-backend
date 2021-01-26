import Joi from "joi";

import User from "../../model/user";
import Post from "../../model/post";

export const check = async (ctx) => {
  const { user } = ctx.state;
  ctx.body = user;
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
    });

    await user.setPassword(password);
    user.generateEmailToken();
    await user.sendConfirmEmail();
    await user.save();

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

export const confirmEmail = async (ctx) => {
  const { id, token } = ctx.params;

  const schema = Joi.string().length(32);
  const result = schema.validate(token);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    if (user.emailToken !== token) {
      ctx.status = 401;
      return;
    }

    user.emailToken = "";
    user.emailConfirmed = true;
    await user.save();

    ctx.body = `
      <script>
        alert("Successfully confirmed your email!");
        window.close();
      </script>
    `;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const resendConfirmEmail = async (ctx) => {
  const { id } = ctx.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      ctx.status = 400;
      return;
    }

    user.generateEmailToken();
    user.emailConfirmed = false;
    await user.sendConfirmEmail();
    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const edit = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(12),
    newPassword: Joi.string().min(12),
    confirmNewPassword: Joi.string().min(12),
    name: Joi.string(),
    nickname: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password, newPassword, confirmNewPassword, name, nickname } = ctx.request.body;

  try {
    const user = await User.findById(ctx.state.user.id);
    if (!user) {
      ctx.status = 401;
      return;
    }

    if (password && newPassword && confirmNewPassword) {
      const isValid = await user.checkPassword(password);
      if (!isValid) {
        ctx.status = 401;
        return;
      }

      if (newPassword === confirmNewPassword) {
        await user.setPassword(newPassword);
      }
    } else {
      ctx.status = 400;
      return;
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.nickname = nickname || user.nickname;

    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const unregister = async (ctx) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(12).required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { password } = ctx.request.body;
  if (!password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findById(ctx.state.user.id);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      ctx.status = 401;
      return;
    }

    await Post.deleteMany({ _id: user.toJSON().myPosts });

    const nickname = user.nickname;
    await user.deleteOne();

    ctx.body = `Bye, ${nickname}!`;
  } catch (e) {
    ctx.throw(500, e);
  }
};
