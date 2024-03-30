import express  from "express";
import productsRouter from "./routes/productsRouter.js"
import cartRouter from "./routes/cartRouter.js"

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);



app.listen(port, () => { 
  console.log(`Corriendo aplicacion en el puerto ${port}`);
});