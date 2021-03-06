import mongoose from "mongoose";
import Joi from "joi";

import Tag from "../../model/tag";

export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);
  const { tag } = ctx.query;

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const query = {
    ...(tag ? { tagName: { $regex: tag, $options: "i" } } : {}),
  };

  try {
    const numTagsPerPage = 30;
    const tags = await Tag.find(query)
      .limit(numTagsPerPage)
      .skip((page - 1) * numTagsPerPage)
      .exec();
    const tagCount = await Tag.countDocuments(query).exec();

    ctx.body = {
      lastPage: Math.ceil(tagCount / numTagsPerPage),
      tags,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const create = async (ctx) => {
  const schema = Joi.object({
    tagName: Joi.string().regex(/^\S+$/),
  });

  const result = schema.validate(ctx.params);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { tagName } = ctx.params;

  try {
    const isTagExists = await Tag.findOne({ tagName });
    if (isTagExists) {
      ctx.status = 409;
      return;
    }

    const tag = new Tag({ tagName });
    await tag.saveTag();

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
  } catch (e) {
    ctx.throw(500, e);
  }
};
