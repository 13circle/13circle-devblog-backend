import Joi from "joi";
import mongoose from "mongoose";

import Comment from "../../model/comment";
import Post from "../../model/post";

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
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    parent: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { content } = ctx.request.body;
  const parent = ctx.request.body.parent || null;

  if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
    ctx.status = 400;
    return;
  }

  try {
    const parentComment = await Comment.findById(parent);

    if (!parentComment) {
      ctx.status = 404;
      return;
    }

    const { user, post } = ctx.state;

    const comment = new Comment({
      author: user.id,
      post: post._id,
      content,
      parent,
    });

    await comment.save();

    await Post.findByIdAndUpdate(
      post._id,
      {
        "$push": { "comments": comment._id },
      },
      {
        "new": true,
        "upsert": true,
      }
    );

    ctx.body = comment;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const edit = async (ctx) => {
  ctx.body = "PATCH /comments/:id";
};

export const remove = async (ctx) => {
  ctx.body = "DELETE /comments/:id";
};
