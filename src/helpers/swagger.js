import __dirname from '../utlis.js';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación API Ecommerce',
      description: 'API de Ecommerce'
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
};

export const specs = swaggerJsdoc(swaggerOptions);