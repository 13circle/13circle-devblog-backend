import mongoose from "mongoose";

import Post from "../model/post";

const getCurrentPost = async (ctx, next) => {
  const { id } = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const post = await Post.findById(id).populate("author", "-password");

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.status.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export default getCurrentPost;
