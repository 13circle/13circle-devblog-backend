import Router from "koa-router";

import * as usersCtrl from "./users.ctrl";

const users = new Router();

users.get("/check", usersCtrl.check);
users.post("/register", usersCtrl.register);
users.post("/login", usersCtrl.login);
users.post("/logout", usersCtrl.logout);
users.patch("/edit", usersCtrl.edit);
users.delete("/unregister", usersCtrl.unregister);

export default users;

