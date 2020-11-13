import Router from "koa-router";

import user from "./user";

const api = new Router();

api.use("/users", user.routes());

export default api;

