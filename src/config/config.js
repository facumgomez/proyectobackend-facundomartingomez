import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect('mongodb+srv://gomezmfacundo:CRIWaoaOzqqUpo8O@cluster0.mo6ehjs.mongodb.net/ecommerce');
    console.log ('Base de datos levantada');
  } catch (error) {
    console.log (`Error para levantar la base de datos ${error}`);
    process.exit(1);
  }
}