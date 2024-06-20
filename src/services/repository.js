import CartsDao from '../dao/cartsMemoryDao.js';
import ProductsDao from '../dao/productsMemoryDao.js';
import UsersDao from '../dao/usersMemoryDao.js';
import CartsRepository from './repository/cartsRepository.js';
import ProductsRepository from './repository/productsRepository.js';
import UsersRepository from './repository/usersRepository.js';

export const cartService = new CartsRepository(new CartsDao);
export const productService = new ProductsRepository(new ProductsDao);
export const userService = new UsersRepository(new UsersDao);