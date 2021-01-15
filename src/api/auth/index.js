import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";

import * as authCtrl from "./auth.ctrl";

const auth = new Router();

auth.get("/", checkLoginStatus, authCtrl.check);
auth.post("/register", authCtrl.register);
auth.post("/login", authCtrl.login);
auth.get("/confirm-email/:id/:token", checkIdParam, authCtrl.confirmEmail);
auth.post("/resend-confirm-email/:id", checkIdParam, authCtrl.resendConfirmEmail);
auth.patch("/", checkLoginStatus, authCtrl.edit);
auth.delete("/", checkLoginStatus, authCtrl.unregister);

export default auth;
