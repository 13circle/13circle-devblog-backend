import Router from "koa-router";

import user from "./user";
import post from "./post";
import comment from "./comment";

const api = new Router();

api.use("/users", user.routes());
api.use("/posts", post.routes());
api.use("/comments", comment.routes());

export default api;

