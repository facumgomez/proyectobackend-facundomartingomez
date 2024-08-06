import { expect } from 'chai'
import supertest from 'supertest-session';
import { fakerES as faker } from '@faker-js/faker';

const requester = supertest('http://localhost:8080');

describe('Testing Sessions Module', () => {
  let userMock;

  before(() => {
    userMock = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
      age: faker.number.int({ min: 18, max: 80 })
    };
  });

  describe('Test POST /register endpoint', () => {
    it('El endpoint POST /api/sessions/register debe registrar un usuario', async () => {
      const response = await requester.post('/api/sessions/register').send(userMock);
      console.log(response.body)
      expect(response.status).to.be.equal(302);
    });
  });

  describe('Test POST /login endpoint', () => {
    it('El endpoint POST /api/sessions/login debe autenticar un usuario', async () => {
      const response = await requester.post('/api/sessions/login').send({
        email: userMock.email,
        password: userMock.password
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers['set-cookie']).to.exist;
    });
  });
});
