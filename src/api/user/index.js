import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";

import * as usersCtrl from "./users.ctrl";

const users = new Router();

users.get("/", checkLoginStatus, usersCtrl.check);
users.post("/register", usersCtrl.register);
users.post("/login", usersCtrl.login);
users.get("/confirm-email/:id/:token", checkIdParam, usersCtrl.confirmEmail);
users.post("/resend-confirm-email/:id", checkIdParam, usersCtrl.resendConfirmEmail);
users.patch("/", checkLoginStatus, usersCtrl.edit);
users.delete("/", checkLoginStatus, usersCtrl.unregister);

export default users;
