import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import checkIdParam from "../../util/checkIdParam";
import checkEmailConfirmed from "../../util/checkEmailConfirmed";
import getCurrentPost from "../../util/getCurrentPost";
import checkPostOwner from "../../util/checkPostOnwer";
import mapTagNameToId from "../../util/mapTagNameToId";

import * as postsCtrl from "./post.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.get("/user/:author", postsCtrl.userPosts);
posts.get("/:id", checkIdParam, getCurrentPost, postsCtrl.doc);
posts.post("/", checkLoginStatus, checkEmailConfirmed, mapTagNameToId, postsCtrl.add);
posts.patch("/:id", checkLoginStatus, checkIdParam, getCurrentPost, checkPostOwner, mapTagNameToId, postsCtrl.edit);
posts.delete("/:id", checkLoginStatus, checkIdParam, getCurrentPost, checkPostOwner, postsCtrl.remove);

export default posts;
