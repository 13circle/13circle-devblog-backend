const checkPostOnwer = (ctx, next) => {
  const { user, post } = ctx.state;

  if(!post) {
    ctx.status = 500;
    ctx.body = "Call getCurrentPost before this middleware";
    return;
  }

  if (post.author._id.toString() !== user.id.toString()) {
    ctx.status = 403;
    return;
  }

  return next();
};

export default checkPostOnwer;
