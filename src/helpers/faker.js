import { fakerES as faker } from '@faker-js/faker';

export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    category: faker.commerce.productMaterial(),
    thumbnail: faker.image.url(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.string.alphanumeric(6),
    stock: faker.string.numeric(2),
    status: faker.datatype.boolean(),
  };
}