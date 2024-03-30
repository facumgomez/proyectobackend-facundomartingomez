import fs from 'fs';
import ProductManager from './productManager.js';

class CartManager {
  path;
  cart;

  constructor () {
    this.path = './src/data/cart.json';
    this.cart = this.getCartInFile();
  }

  getCartInFile() {
    try {
      if (fs.existsSync(this.path))
        return JSON.parse(fs.readFileSync(this.path,'utf-8'));
      return [];
    } catch (error) {
      console.error (`Ocurrio un error desconcido al momento de leer el archivo, ${error}`);
    };
  }

  saveFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.cart));
    } catch (error) {
      console.error (`Ocurrio un error desconcido al momento de guardar el archivo, ${error}`);
    };
  }

  appointIdCart () {
    let id = 1;
    if (this.cart.length != 0)
      id = this.cart[this.cart.length -1].id + 1;
    return id;
  }

  addCart () {
    const newCart = {
      id: this.appointIdCart(),
      products: []
    };
    this.cart.push(newCart);
    this.saveFile();

    return newCart;
  }

  getCartById (id) {
    const producto = this.cart.find(product => product.id == id);
    if (producto) 
      return producto;
    else 
      return `Not Found product con id ${id}`;
  }

  addProductInCart (cid, pid) {
    cid = Number(cid);
    let message = `El carrito del ${cid} no existe.`

    const indexCart = this.cart.findIndex(cart => cart.id === cid);
    if (indexCart !== -1) {
      const indexProductInCart = this.cart[indexCart].products.findIndex(product => product.id === pid);
      const productManager = new ProductManager();
      const producto = productManager.getProductById(pid);

      if(producto.status && indexProductInCart === -1) {
        this.cart[indexCart].products.push({id: pid, 'quantity': 1});
        this.saveFile();
        message = '¡Producto agregado al carrito con exito!';
      } else if (producto.status && indexProductInCart !== -1) {
        ++this.cart[indexCart].products[indexProductInCart].quantity;
        this.saveFile();
        message = '¡Producto agregado al carrito con exito!';
      }else {
        message = `El producto del ${pid} no existe.`
      }
    }
    return message;
  }
}


export default CartManager;