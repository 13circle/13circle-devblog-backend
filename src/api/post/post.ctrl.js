import Joi from "joi";

import User from "../../model/user";
import Post from "../../model/post";

const numPostsPerPage = 10;
const maxContentLen = 150;

export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find({})
      .populate("author", "nickname")
      .populate("tags", "tagName")
      .sort({ _id: -1 })
      .limit(numPostsPerPage)
      .skip((page - 1) * numPostsPerPage)
      .exec();
    const postCount = await Post.countDocuments().exec();

    ctx.body = {
      lastPage: Math.ceil(postCount / numPostsPerPage),
      posts: posts.map((post) => ({
        ...post.toJSON(),
        content: post.getBriefContent(maxContentLen),
      })),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const userPosts = async (ctx) => {
  const { author } = ctx.request.params;

  if (!author) {
    ctx.status = 400;
    return;
  }

  try {
    const user = await User.findOne({ nickname: author });
    if (!user) {
      ctx.status = 400;
      return;
    }

    const posts = user.toJSON().myPosts;
    for (let i in posts) {
      const post = await Post.findById(posts[i]).populate("tags").exec();
      post.content = post.getBriefContent(maxContentLen);
      posts[i] = post.toJSON();
    }

    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const doc = async (ctx) => {
  const { post } = ctx.state;
  try {
    ctx.body = await Post.findById(post._id).populate("tags", "tagName");
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const search = async (ctx) => {
  ctx.body = "GET /posts/search";
};

export const add = async (ctx) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().required(),
    tags: Joi.array().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, content } = ctx.request.body;
  const { user, tags } = ctx.state;

  try {
    const isTitleExsits = await Post.findOne({ title });
    if (isTitleExsits) {
      ctx.status = 409;
      return;
    }

    const post = new Post({
      author: user.id,
      tags,
      title,
      content,
    });
    await post.save();

    const userModel = await User.findById(user.id);
    userModel.myPosts.push(post._id);
    await userModel.save();

    ctx.body = await Post.findById(post._id).populate("tags");
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const edit = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().min(3),
    content: Joi.string(),
    tags: Joi.array(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.params;

  try {
    const modified = await Post.findByIdAndUpdate(id, { ...ctx.request.body }, { new: true });

    ctx.body = modified;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;
  const { user } = ctx.state;

  try {
    await User.findByIdAndUpdate(user.id, { $pull: { myPosts: id } }, {});
    await Post.findByIdAndDelete(id);

    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
