import Router from "koa-router";

import * as usersCtrl from "./users.ctrl";

const users = new Router();

users.post("/register", usersCtrl.register);
users.post("/login", usersCtrl.login);
users.patch("/edit", usersCtrl.edit);
/*
users.post("/login", ());
users.get("/check", ());
users.post("/logout", ());
users.delete("/unregister", ());
*/

export default users;

