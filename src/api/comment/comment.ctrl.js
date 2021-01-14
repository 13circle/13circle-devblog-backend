import Joi from "joi";

import User from "../../model/user";
import Comment from "../../model/comment";

export const listByPost = async (ctx) => {
  ctx.body = "GET /comments/:id";
};

export const add = async (ctx) => {
  ctx.body = "POST /comments";
};

export const edit = async (ctx) => {
  ctx.body = "PATCH /comments/:id";
};

export const remove = async (ctx) => {
  ctx.body = "DELETE /comments/:id";
};
