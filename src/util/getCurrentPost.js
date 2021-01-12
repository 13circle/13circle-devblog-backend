import Post from "../model/post";

const getCurrentPost = async (ctx, next) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).populate("author", "-password -name");

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export default getCurrentPost;
