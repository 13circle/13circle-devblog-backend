import Router from "koa-router";

import * as commentsCtrl from "./comment.ctrl";

const comments = new Router();

comments.get("/:id", commentsCtrl.read);
comments.post("/", commentsCtrl.add);
comments.patch("/:id", commentsCtrl.edit);
comments.delete("/:id", commentsCtrl.remove);

export default comments;
