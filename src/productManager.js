import fs from 'fs';

class ProdcutManager {
  path;
  products;
  static idProduct = 0;

  constructor () {
    this.path = './src/data/products.json';
    this.products = this.getProductsInFile();
  }

  getProductsInFile() {
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
        fs.writeFileSync(this.path, JSON.stringify(this.products));
      } catch (error) {
        console.error (`Ocurrio un error desconcido al momento de guardar el archivo, ${error}`);
      };
    }

    appointId () {
      let id = 1;
      if(this.products.length != 0)
        id = this.products[this.products.length -1].id + 1;
      return id;
    }

  addProduct (title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return `Todos los parametros son requeridos`;

    const codeRep = this.products.some(product => product.code == code);
    if (codeRep)
      return `El codigo ${code} ya se encuentra registrado`;

    ProdcutManager.idProduct = ProdcutManager.idProduct + 1;
    const id = this.appointId();
    const newProduct = {
      id:id,
      title:title,
      description:description,
      price:price,
      thumbnail:thumbnail,
      code:code,
      stock:stock
    };
    this.products.push(newProduct);
    this.saveFile();
    return '¡Se agrego exitosamente!';
  }

  getProducts (limit = 0) {
    limit = Number(limit);
    if (limit > 0)
      return this.products.slice(0, limit);
    return this.products;
  }

  getProductById (id) {
    const producto = this.products.find(product => product.id == id);
    if (producto) 
      return producto;
    else 
      return `Not Found product con id ${id}`;
  }

  updateProduct (id, objectUpdate) {
    const index = this.products.findIndex(product => product.id === id);
    let message = `El producto no existe ${id}`;

    if (index !== -1) {
      const {id, ...others} = objectUpdate;
      this.products[index] = {...this.products[index], ...others};
      this.saveFile();
      message = '¡Producto actualizado!';
    }; 
    return message;
  }

  deleteProduct (id) {
    const index = this.products.findIndex(product => product.id === id);
    let message = `El producto no existe ${id}`;

    if (index !== -1) {
      this.products = this.products.filter(product => product.id !== id);
      this.saveFile();
      message = '¡Producto eliminado!';
    }; 
    return message;
  }
}

export default ProdcutManager;