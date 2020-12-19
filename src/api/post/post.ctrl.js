import Joi from "joi";

import User from "../../model/user";
import Post from "../../model/post";
import Tag from "../../model/tag";

export const list = async (ctx, next) => {
  ctx.body = "GET /posts";
};

export const mylist = async (ctx, next) => {
  ctx.body = "GET /posts/mylist/:author";
};

export const doc = async (ctx, next) => {
  ctx.body = "GET /posts/doc/:id";
};

export const search = async (ctx, next) => {
  ctx.body = "GET /posts/search";
};

export const add = async (ctx, next) => {
  ctx.body = "POST /posts";
};

export const edit = async (ctx, next) => {
  ctx.body = "PATCH /posts/:id";
};

export const remove = async (ctx, next) => {
  ctx.body = "DELETE /posts/:id";
};
