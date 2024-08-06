import { expect } from 'chai'
import supertest from 'supertest';
import { fakerES as faker } from '@faker-js/faker';

const requester = supertest('http://localhost:8080');

describe('Testing Products Module', () => {
  describe('Test POST and PUT endpoints', () => {
    it('El endpoint POST/api/products debe crear un producto y el endpoint PUT/api/products/:pid debe poder actualizarlo', async () => {
      const productMock = {      
        title: 'MacBook Air 13" M2 Chip 8-Core CPU 8-Core GPU 256GB - Midnight',
        category: 'Mac',
        thumbnail: 'https://ibb.co/8YNB7QC',
        description: 'MacBook Air 13"',
        price: 2109900,
        code: faker.string.alphanumeric(6),
        stock: 1,
        status: true,
      }
      const responsePOST = await requester.post('/api/products').send(productMock);
      expect(responsePOST._body.payload).to.have.property('_id');

      const productUpdateMock = {      
        title: 'MacBook Air 13" M2 Chip 8-Core CPU 8-Core GPU 256GB - Midnight',
        category: 'Mac',
        thumbnail: 'https://ibb.co/8YNB7QC',
        description: 'La notebook más ligera y delgada vuelve completamente renovada por dentro. Gracias al chip M2 de Apple y el CPU de 8 núcleos. Nunca ha sido tan fácil llevar tanto poder a todos lados. ',
        price: 2809900,
        stock: 10,
        status: true,
      };
      const responsePUT = await requester.put(`/api/products/${responsePOST._body.payload._id}`).send(productUpdateMock);
      expect(responsePUT._body.status).to.be.equal('success');
    });
  });

  describe('Test GET endpoints', () => {
    it('El endpoint POST /api/products debe obetener todos los productos', async () => {
      const response = await requester.get('/api/products');
      expect(response.statusCode).to.be.equal(200);
    });

    it('El endpoint POST /api/products/:pid debe obtener un producto por id', async () => { 
      const response = await requester.get('/api/products/66b19830498cb72548de9561');
      expect(response.statusCode).to.be.equal(200);
    });
  });
})