import { model, Schema } from "mongoose";
import timezone from "mongoose-timezone";

const TagSchema = new Schema({
  tagName: { type: String, unique: true, required: true },
});

TagSchema.methods.saveTag = async function () {
  this.tagName = this.tagName.toLowerCase();
  await this.save();
};

TagSchema.plugin(timezone);

const Tag = model("Tag", TagSchema);

export default Tag;
