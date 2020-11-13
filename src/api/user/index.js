import Router from "koa-router";

import * as usersCtrl from "./users.ctrl";

const users = new Router();

users.post("/register", usersCtrl.register);
/*
user.post("/login", ());
user.get("/check", ());
user.post("/logout", ());
user.patch("/edit", ());
user.delete("/unregister", ());
*/

export default users;

