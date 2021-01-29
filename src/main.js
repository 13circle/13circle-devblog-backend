import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import dotenv from "dotenv";
import mongoose from "mongoose";

import api from "./api";
import jwtMiddleware from "./util/jwtMiddleware";

dotenv.config();

const { NODE_ENV, PORT, MONGO_URI } = process.env;

if (!NODE_ENV) {
  throw Error("No NODE_ENV to specify app environment status");
} else if (NODE_ENV !== "development" && NODE_ENV !== "production") {
  throw Error("NODE_ENV must be 'development' or 'production'");
}

if (!MONGO_URI) {
  throw Error("No MONGO_URI to connect with the MongoDB");
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
	console.log("Connected to MongoDB");
  } catch(e) {
    console.error(e);
  }
}
connectDB();

const app = new Koa();
const router = new Router();

router.use("/api", api.routes());

if (NODE_ENV === "development") {
  app.use(logger());
} else {
  console.log = function () {};
}

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

