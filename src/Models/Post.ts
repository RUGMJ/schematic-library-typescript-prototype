import { Schema, model } from 'mongoose';

export default model("Post", new Schema({
  title: String,
  schematic: { type: Schema.Types.ObjectId, ref: "Schematic" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}))


