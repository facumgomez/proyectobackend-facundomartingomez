import express  from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from './utlis.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import viewsProductsRouter from './routes/viewsProductsRouter.js'
import viewsCartsRouter from './routes/viewsCartsRouter.js'
import sessionRouter from './routes/sessionRouter.js'
import { dbConnection } from './config/config.js';
import productModel from './dao/models/productModel.js';
import messageModel from './dao/models/messageModel.js';

const app = express();
const port = 8080;
const uri = 'mongodb+srv://gomezmfacundo:CRIWaoaOzqqUpo8O@cluster0.mo6ehjs.mongodb.net/ecommerce';

app.use(session({
  store: MongoStore.create({
    mongoUrl: uri}),
  secret: 'Cod3r123',
  resave: true,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use('/products', viewsProductsRouter);
app.use('/cart', viewsCartsRouter);
app.use('/', sessionRouter);

await dbConnection();
const serverExpress = app.listen(port, () => { 
  console.log(`Corriendo aplicacion en el puerto ${port}`);
});

const io = new Server (serverExpress);
io.on('connection', async (socket) => {
  const product = await productModel.find().lean().exec();
  socket.emit('product', product);
  socket.on('createProducts', async (product) => {
    const newProduct = await productModel.create({...product});
    if (newProduct) {
      product.push(newProduct);
      socket.emit('product', product);
    };
  });

  const messages = await messageModel.find();
  socket.emit('message', messages);
  socket.on('message', async (data) => {
    const newMessage = await messageModel.create({...data});
    if (newMessage) {
      const messages = await messageModel.find();
      io.emit('messageLogs', messages);
    };
  });
  socket.broadcast.emit('nuevoUser');
});

mongoose.set('strictQuery', false);
mongoose.connect(uri);