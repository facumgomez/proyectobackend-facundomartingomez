import express  from 'express';
import { Server, Socket } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utlis.js';
import ProductManager from './dao/productManager.js';

const app = express();
const port = 8080;
const products = new ProductManager();

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const serverExpress = app.listen(port, () => { 
  console.log(`Corriendo aplicacion en el puerto ${port}`);
});

const serverSocket = new Server (serverExpress);

serverSocket.on('connection', socket => {
  const product = products.getProducts();
  socket.emit('product', product);

  socket.on('addProducts', product => {
    console.log({product})
    const message = products.addProduct({...product});
    console.log({message})
    if (message.product)
    socket.emit('product', message.product)
  });
});