import Router from "koa-router";

import * as tagsCtrl from "./tags.ctrl";
import checkLoginStatus from "../../util/checkLoginStatus";

const tags = new Router();

tags.get("/", tagsCtrl.list);
tags.post("/", checkLoginStatus, tagsCtrl.create);

export default tags;
