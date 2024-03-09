class ProdcutManager {
  #products;
  static idProduct = 0;

  constructor () {
    this.#products = [];
  }

  addProduct (title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return `Todos los parametros son requeridos`;

    const codeRep = this.#products.some (product => product.code == code);
    if (codeRep)
      return `El codigo ${code} ya se encuentra registrado`;

    ProdcutManager.idProduct = ProdcutManager.idProduct + 1;
    const id = ProdcutManager.idProduct;
    const newProduct = {
      id:id,
      title:title,
      description:description,
      price:price,
      thumbnail:thumbnail,
      code:code,
      stock:stock
    };
    this.#products.push(newProduct)
    return '¡Se agrego exitosamente!';
  }

  getProducts () {
    return this.#products;
  }

  getProductById () {
    const producto = this.#products.find (product => product.id == id);
    if (producto)
      return producto;
    else 
      return `Not Found producto con id ${id}`;
  }
}

module.exports = ProdcutManager;