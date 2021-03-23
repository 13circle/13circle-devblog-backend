import { model, Schema } from "mongoose";

const TagSchema = new Schema({
  tagName: { type: String, unique: true, required: true },
});

const Tag = model("Tag", TagSchema);

export default Tag;
