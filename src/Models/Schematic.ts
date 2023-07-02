import { Schema, model } from 'mongoose';

export default model('Schematic', new Schema({
  data: { required: true, type: Buffer }
}))
