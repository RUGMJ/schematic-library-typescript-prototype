import { Schema, model } from 'mongoose';

export default model("Comment", new Schema({
  content: { required: true, type: String },
  timestamp: { type: Date, default: Date.now }
}))
