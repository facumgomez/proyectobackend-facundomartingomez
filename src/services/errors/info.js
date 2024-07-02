export const generateErrorInfo = ( product ) => {
  return `
  Una o más propiedades estaban incompletas o no son válidas.
  Lista de propiedades requeridas:
    • title: Must be a string. Received (${product.title}) 
    • category: Must be a string. Received (${product.category})
    • thumbnail: Must be a string. Received (${product.thumbnail})
    • description: Must be a string. Received (${product.description})
    • price: Must be a number. Received (${product.price})
    • code: Must be a string. Received (${product.code})
    • stock: Must be a number. Received (${product.stock})
    • status: Must be a boolean. Received (${product.status})
  `
}