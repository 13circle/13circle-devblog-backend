import { model, Schema } from "mongoose";

const TagSchema = new Schema({
  tagName: { type: String, unique: true, required: true },
});

TagSchema.methods.saveTag = async function () {
  this.tagName = this.tagName.toLowerCase();
  await this.save();
};

const Tag = model("Tag", TagSchema);

export default Tag;
