import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testing Carts Module', () => {
  describe('Test POST and PUT endpoints', () => {
    it('El endpoint POST/cart debe crear un carrito y el endpoint PUT/cart/:cid debe poder actualizarlo', async () => {
      const cartMock = {
        products: [
          {
            product: '6631d9e85f73b801b3f498b0', 
            quantity: 2,
          },
        ],
      };
      const responsePOST = await requester.post('/api/cart').send(cartMock);
      expect(responsePOST._body.payload).to.have.property('_id');

      const cartUpdateMock = {
        products: [
          {
            product: '6631d9e85f73b801b3f498b0',  
            quantity: 5,
          },
        ],
      };
      const responsePUT = await requester.put(`/api/cart/${responsePOST._body.payload._id}`).send(cartUpdateMock);
      expect(responsePUT._body.status).to.be.equal('success');
    });
  });

  describe('Test GET endpoints', () => {
    it('El endpoint GET /api/cart debe obtener todos los carritos', async () => {
      const response = await requester.get('/api/cart');
      expect(response.statusCode).to.be.equal(200);
    });

    it('El endpoint GET /api/cart/:cid debe obtener un carrito por id', async () => {
      const response = await requester.get('/cart/66b164fee4d7203e9d3bfdb8');
      expect(response.statusCode).to.be.equal(200);
    });
  });
});
