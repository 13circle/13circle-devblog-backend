import jwt from "jsonwebtoken";
import User from "../model/user";

const jwtMiddleware = async (ctx, next) => {
  const { authroization } = ctx.request.headers;
  if (!authroization) return next;

  const token = authroization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    ctx.state.user = {
      id: user._id,
      nickname: user.nickname,
    };
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
