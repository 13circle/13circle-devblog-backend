import Router from "koa-router";

import * as tagsCtrl from "./tags.ctrl";
import checkLoginStatus from "../../util/checkLoginStatus";
import checkAdmin from "../../util/checkAdmin";
import checkIdParam from "../../util/checkIdParam";

const tags = new Router();

tags.get("/", tagsCtrl.list);
tags.post("/:tagName", checkLoginStatus, tagsCtrl.create);
tags.delete("/:id", checkIdParam, checkLoginStatus, checkAdmin, tagsCtrl.remove);

export default tags;
