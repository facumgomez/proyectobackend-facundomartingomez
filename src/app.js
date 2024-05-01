import express  from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utlis.js';
import { dbConnection } from './config/config.js';
import productModel from './dao/models/productsModel.js';
import messageModel from './dao/models/messageModel.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

await dbConnection();
const serverExpress = app.listen(port, () => { 
  console.log(`Corriendo aplicacion en el puerto ${port}`);
});
const io = new Server (serverExpress);

io.on('connection', async (socket) => {
  const product = await productModel.find();
  socket.emit('product', product);
  socket.on('createProducts', async (product) => {
    const newProduct = await productModel.create({...product});
    if (newProduct){
      product.push(newProduct)
      socket.emit('product', product)
    }
  });

  const messages = await messageModel.find();
  socket.emit('message', messages);
  socket.on('message', async (data) =>{
    const newMessage = await messageModel.create({...data});
    if (newMessage){
      const messages = await messageModel.find();
      io.emit('messageLogs', messages)
    }
  });
  socket.broadcast.emit('nuevoUser')
});