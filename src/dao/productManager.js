import fs from 'fs';

class ProductManager {
  path;
  products;
  static instance;

  constructor () {
    if(ProductManager.instance)
      return ProductManager.instance;
    this.path = './src/data/products.json';
    this.products = this.getProductsInFile();

    ProductManager.instance = this;
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

  addProduct ({title, category, thumbnail, description, price, code, stock, status=true}) {
    let message = [];
    if (!title ||!category || !description || !price  || !code || !stock)
      message = 'Todos los parametros son requeridos (title, catogory, thumbnail, description, price, code, stock)';
    else{
      const codeRep = this.products.some(product => product.code == code);
      if (codeRep)
        message = `El codigo ${code} ya se encuentra registrado`;
      else{
        const id = this.appointId();
        const newProduct = {
          id:id,
          title:title,
          category:category,
          thumbnail:thumbnail,
          description:description,
          price:price,
          code:code,
          stock:stock,
          status:status
          };
          this.products.push(newProduct);
          this.saveFile();
          message = {
            message: '¡Se agrego exitosamente!',
            product: newProduct
          };
        }
      }
    return message;
  }

  getProducts (limit = 0) {
    limit = Number(limit);
    if (limit > 0)
      return this.products.slice(0, limit);
    return this.products;
  }

  getProductById (id) {
    const producto = this.products.find(product => product.id == id);
    let status = false;
    let message = `El producto del id ${id} no existe.`;
    if (producto) {
      status = true;
      message = producto;
    }
    return {status, message}
  }

  updateProduct (id, objectUpdate) {
    const index = this.products.findIndex(product => product.id === id);
    let message = `El producto no existe ${id}`;

    if (index !== -1) {
      const {id, ...others} = objectUpdate;
      this.products[index] = {...this.products[index], ...others};
      this.saveFile();
      message = {
        message: '¡Producto actualizado!',
        producto: this.products[index]
      };
    }
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

export default ProductManager;