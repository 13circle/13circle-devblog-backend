import Joi from "joi";

import Tag from "../model/tag";

const mapTagNameToId = async (ctx, next) => {
  const result = Joi.object({
    tags: Joi.array().min(1).items(Joi.string().regex(/^\S+$/)).required(),
  })
    .unknown()
    .validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { tags } = ctx.request.body;

  if (!tags) {
    ctx.status = 400;
    return;
  }

  try {
    for (let i in tags) {
      tags[i] = tags[i].toLowerCase();

      const tag = await Tag.findOne({ tagName: tags[i] });

      if (tag) {
        tags[i] = tag._id;
      } else {
        const newTag = new Tag({ tagName: tags[i] });
        await newTag.save();
        tags[i] = newTag._id;
      }
    }

    ctx.state.tags = tags;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};

export default mapTagNameToId;
