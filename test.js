const ProdcutManager = require("./productManager");

const producto = new ProdcutManager ();

console.log (producto.addProduct('producto prueba 1', 'este es un producto prueba', '100', 'sin imagen', 'abc123', '25'));
console.log (producto.addProduct('producto prueba 2', 'este es un producto prueba', '200', 'sin imagen', 'abc456', '50'));
console.log (producto.addProduct('producto prueba 3', 'este es un producto prueba', '300', 'sin imagen', 'abc789', '75'));

console.log(producto.getProducts());