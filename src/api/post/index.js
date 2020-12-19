import Router from "koa-router";

import * as postsCtrl from "./post.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.get("/mylist/:author", postsCtrl.mylist);
posts.get("/doc/:id", postsCtrl.doc);
posts.get("/search", postsCtrl.search);
posts.post("/", postsCtrl.add);
posts.patch("/:id", postsCtrl.edit);
posts.delete("/:id", postsCtrl.remove);

export default posts;
