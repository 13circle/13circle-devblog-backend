import Router from "koa-router";

import * as usersCtrl from "./users.ctrl";
import checkLoginStatus from "../../util/checkLoginStatus";

const users = new Router();

users.get("/", checkLoginStatus, usersCtrl.check);
users.post("/register", usersCtrl.register);
users.post("/login", usersCtrl.login);
users.patch("/", checkLoginStatus, usersCtrl.edit);
users.delete("/", checkLoginStatus, usersCtrl.unregister);

export default users;
