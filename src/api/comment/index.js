import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";
import getCurrentPost from "../../util/getCurrentPost";

import * as commentsCtrl from "./comment.ctrl";

const comments = new Router();

comments.get("/:id", checkLoginStatus, checkIdParam, getCurrentPost, commentsCtrl.listByPost);
comments.post("/", checkLoginStatus, commentsCtrl.add);
comments.patch("/:id", checkLoginStatus, checkIdParam, commentsCtrl.edit);
comments.delete("/:id", checkLoginStatus, checkIdParam, commentsCtrl.remove);

export default comments;
