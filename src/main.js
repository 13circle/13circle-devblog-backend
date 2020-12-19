import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import api from "./api";

dotenv.config();

const { PORT, MONGO_URI } = process.env;

if(!MONGO_URI) {
  throw Error("No MONGO_URI to connect with the MongoDB");
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
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

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

