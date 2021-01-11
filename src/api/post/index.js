import Router from "koa-router";

import checkLoginStatus from "../../util/checkLoginStatus";
import getCurrentPost from "../../util/getCurrentPost";
import checkPostOwner from "../../util/checkPostOnwer";
import mapTagNameToId from "../../util/mapTagNameToId";

import * as postsCtrl from "./post.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.get("/user/:author", postsCtrl.userPosts);
posts.get("/:id", getCurrentPost, postsCtrl.doc);
posts.get("/search", postsCtrl.search);
posts.post("/", checkLoginStatus, mapTagNameToId, postsCtrl.add);
posts.patch("/:id", checkLoginStatus, getCurrentPost, checkPostOwner, mapTagNameToId, postsCtrl.edit);
posts.delete("/:id", checkLoginStatus, getCurrentPost, checkPostOwner, postsCtrl.remove);

export default posts;
