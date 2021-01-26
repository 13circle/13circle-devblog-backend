import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";

import * as authCtrl from "./auth.ctrl";

const auth = new Router();

auth.get("/check", checkLoginStatus, authCtrl.check);
auth.post("/register", authCtrl.register);
auth.post("/login", authCtrl.login);
auth.post("/confirm-email/:id/:token", checkIdParam, authCtrl.confirmEmail);
auth.post("/resend-confirm-email/:id", checkIdParam, authCtrl.resendConfirmEmail);
auth.patch("/edit", checkLoginStatus, authCtrl.edit);
auth.delete("/unregister", checkLoginStatus, authCtrl.unregister);

export default auth;
