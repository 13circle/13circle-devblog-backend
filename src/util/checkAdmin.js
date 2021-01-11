import User from "../model/user";

const checkAdmin = async (ctx, next) => {
  const user = await User.findById(ctx.state.user.id);
  
  if(user.privilege === "User") {
    ctx.status = 401;
    return;
  }

  return next();
};

export default checkAdmin;
