import Joi from "joi"

import User from "../../model/user";
import Post from "../../model/post";

export const list = async (ctx) => {
  ctx.body = "GET /posts";
};

export const mylist = async (ctx) => {
  const schema = Joi.object().keys({
    author: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.params);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { author } = ctx.request.params;

  try {
    const post = await User.findOne({ nickname: author }).populate("myPosts");
    if (post.length === 0) {
      ctx.status = 404;
      return;
    }

    ctx.body = post.map((d) => d.toJSON);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = "GET /posts/mylist/" + ctx.request.params.author;
};

export const doc = async (ctx) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });
  ctx.body = "GET /posts/doc/" + ctx.request.params.id;
};

export const search = async (ctx) => {
  ctx.body = "GET /posts/search";
};

export const add = async (ctx) => {
  ctx.body = "POST /posts";
};

export const edit = async (ctx) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.params);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  ctx.body = "PATCH /posts/" + ctx.request.params.id;
};

export const remove = async (ctx) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });
  ctx.body = "DELETE /posts/" + ctx.request.params.id;
};
