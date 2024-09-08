import express  from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express';
import path from 'path';

import './dao/connectionMongo.js'
import __dirname from './utlis.js';
import config from './config/config.js';
import initializePassport from './config/passport.js';

import errorHandler from './middlewares/error.js';
import logger from './helpers/logger.js';
import { specs } from './helpers/swagger.js';

import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import usersRouter from './routes/usersRouter.js';
import loggerRouter from './routes/loggerRouter.js';
import { messageService } from './services/repository.js';

const app = express();
const PORT = config.PORT || 8080;
const serverExpress = app.listen(PORT, () => logger.info(`Corriendo aplicacion en el puerto ${PORT}`));

const io = new Server (serverExpress);

io.on('connection', socket => {
  socket.on('message', async (data) => {
    await messageService.create(data);
    const messages = await messageService.getAll();
    io.emit('logs', messages);
  });
});

app.use(session({ secret: config.SESSION_SECRET, resave: true, saveUninitialized: true }));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: 'main.handlebars' }));
app.set('views', path.join (__dirname + '/views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersRouter);
app.use('/loggerTest', loggerRouter);
app.use('/api/documents', swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); 
app.use(errorHandler);