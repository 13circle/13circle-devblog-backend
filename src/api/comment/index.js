import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";
import getCurrentPost from "../../util/getCurrentPost";

import * as commentsCtrl from "./comment.ctrl";

const comments = new Router();

comments.get("/list/:id", checkLoginStatus, checkIdParam, getCurrentPost, commentsCtrl.listByPost);
comments.post("/add/:id", checkLoginStatus, checkIdParam, getCurrentPost, commentsCtrl.add);
comments.patch("/edit/:id", checkLoginStatus, checkIdParam, commentsCtrl.edit);
comments.delete("/remove/:id", checkLoginStatus, checkIdParam, commentsCtrl.remove);

export default comments;
