import  mongoose, { Schema, model } from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  purchaser: { 
    type: String, 
    required: true
  }
});

mongoose.set('strictQuery', false);
const ticketModel = model(ticketCollection, ticketSchema);

export default ticketModel;