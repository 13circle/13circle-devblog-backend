import mongoose from "mongoose";
import Joi from "joi";

import Tag from "../../model/tag";

export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const numTagsPerPage = 30;
    const tags = await Tag.find()
      .limit(numTagsPerPage)
      .skip((page - 1) * numTagsPerPage)
      .exec();
    ctx.body = tags;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const create = async (ctx) => {
  const schema = Joi.object({
    tagName: Joi.string().regex(/^\S+$/),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { tagName } = ctx.request.body;

  try {
    const isTagExists = await Tag.findOne({ tagName });
    if (isTagExists) {
      ctx.status = 409;
      return;
    }

    const tag = new Tag({ tagName });
    await tag.save();

    ctx.body = tag;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const tag = await Tag.findById(id);
    const { tagName } = tag;

    await tag.deleteOne();

    ctx.body = tagName;
  } catch(e) {
    ctx.throw(500, e);
  }
};
