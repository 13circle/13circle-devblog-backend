import Router from "koa-router";

import auth from "./auth";
import post from "./post";
import comment from "./comment";
import tag from "./tag";

const api = new Router();

api.use("/auth", auth.routes());
api.use("/posts", post.routes());
api.use("/comments", comment.routes());
api.use("/tags", tag.routes());

export default api;
