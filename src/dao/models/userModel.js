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
  cart: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'carts'
    }
  ],
  documents: {
    type: [{
      name: {
        type: String,
        required: true
      },
      reference: {
        type: String,
        required: true
      }
  }],
  default: []
  },
  last_connection: { 
    type: Date, 
    required: true 
  }
});

mongoose.set('strictQuery', false);
const userModel = model(userCollection, userSchema);

export default userModel;