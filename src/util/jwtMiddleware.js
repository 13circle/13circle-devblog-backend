import jwt from "jsonwebtoken";

export const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get("access_token");
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      id: decoded._id,
      username: decoded.nickname,
    };
    console.log(decoded);
    return next();
  } catch (e) {
    return next();
  }
};
