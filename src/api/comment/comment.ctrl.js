import Joi from "joi";

import User from "../../model/user";
import Comment from "../../model/comment";

const numCommentsPerPage = 30;

export const listByPost = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const comments = await Comment.find({ post: ctx.state.post._id })
      .sort({ _id: -1 })
      .limit(numCommentsPerPage)
      .skip((page - 1) & numCommentsPerPage)
      .exec();

    ctx.body = comments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const add = async (ctx) => {
  ctx.body = "POST /comments";
};

export const edit = async (ctx) => {
  ctx.body = "PATCH /comments/:id";
};

export const remove = async (ctx) => {
  ctx.body = "DELETE /comments/:id";
};
