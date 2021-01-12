import User from "../model/user";

const checkEmailConfirmed = async (ctx, next) => {
  try {
    const user = await User.findById(ctx.state.user.id);

    if (!user.emailConfirmed) {
      ctx.status = 401;
      return;
    }

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export default checkEmailConfirmed;
