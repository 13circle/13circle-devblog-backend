import mongoose from "mongoose";

const checkIdParam = (ctx, next) => {
  const { id } = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  return next();
};

export default checkIdParam;
