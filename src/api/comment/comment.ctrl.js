import Joi from "joi";

import User from "../../model/user";
import Comment from "../../model/comment";

export const read = async (ctx, next) => {
  ctx.body = "GET /comments/:id";
};

export const add = async (ctx, next) => {
  ctx.body = "POST /comments";
};

export const edit = async (ctx, next) => {
  ctx.body = "PATCH /comments/:id";
};

export const remove = async (ctx, next) => {
  ctx.body = "DELETE /comments/:id";
};
