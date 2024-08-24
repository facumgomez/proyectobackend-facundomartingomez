import { Schema, model } from 'mongoose';

const messageCollection = 'messages';

const messageSchema = new Schema({
  user: {
    type: String,
    requiered: true,
  },
  email: {
    type: String,
    requiered: true,
  },
  message: {
    type: String,
    requiered: true
  }
});

const messageModel = model(messageCollection, messageSchema);

export default messageModel;