import mongoose, { Schema, model } from 'mongoose'; 

const userCollection = 'users';
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  cart: [{
    type: Schema.Types.ObjectId, ref: 'cart'
  }]
});

mongoose.set('strictQuery', false);
const userModel = model(userCollection, userSchema);

export default userModel;