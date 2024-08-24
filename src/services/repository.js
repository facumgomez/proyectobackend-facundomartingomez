import CartsMemoryDao from '../dao/cartsMemoryDao.js';
import ProductsDao from '../dao/productsMemoryDao.js';
import UsersDao from '../dao/usersMemoryDao.js';
import MessagesDao from '../dao/messagesMemoryDao.js';
import CartsRepository from './repository/cartsRepository.js';
import ProductsRepository from './repository/productsRepository.js';
import UsersRepository from './repository/usersRepository.js';
import MessagesRepository from './repository/messagesRepository.js';

export const cartService = new CartsRepository(new CartsMemoryDao);
export const productService = new ProductsRepository(new ProductsDao);
export const userService = new UsersRepository(new UsersDao);
export const messageService = new MessagesRepository(new MessagesDao);