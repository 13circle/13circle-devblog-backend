import Joi from "joi";

import User from "../../model/user";

export const register = async (ctx, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required(),
    name: Joi.string().required(),
	nickname: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    email,
    password,
    name,
    nickname
  } = ctx.request.body;

  try {
    const isExists = {
      email: await User.findOne({ email }),
      name: await User.findOne({ name }),
      nickname: await User.findOne({ nickname }),
	};

    if(isExists.email || isExists.name || isExists.nickname) {
      ctx.status = 409;
      return;
	}

    const user = new User({
	  email,
	  password,
	  name,
	  nickname,
    });
    await user.save();

    // Alias of:
    // ctx.response.status = 200;
    // ctx.response.body = user;
	ctx.body = user;
  } catch(e) {
    ctx.throw(500, e);
  }
};

