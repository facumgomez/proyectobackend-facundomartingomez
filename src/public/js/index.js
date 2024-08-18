const socket = io();

socket.on('product', product => {
  const tbody = document.getElementById('tbodyProduct');
  tbody.innerHTML = '';
  product.forEach(product => {
    let row = tbody.insertRow();
    row.innerHTML = `
      <td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.category ? product.category : 'No tiene categoria'}</td>
      <td>${product.thumbnail ? `<a href='${product.thumbnail}' target='_blank'>${product.thumbnail}</a>` : 'No tiene imagen'}</td>
      <td>${product.description}</td>
      <td>$${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.status ? 'Disponible' : 'No disponible'}</td>
    `;
  });
});

const form = document.getElementById('formProduct');
form.addEventListener('submit', function(e) {
  e.preventDefault();

  let title = document.getElementById('title').value;
  let category = document.getElementById('category').value;
  let description = document.getElementById('description').value;
  let price = document.getElementById('price').value;
  let code = document.getElementById('code').value;
  let stock = document.getElementById('stock').value;

  const products = {
    title:title,
    category:category,
    description:description,
    price:price,
    code:code,
    stock:stock,
  };
  socket.emit('createProoducts', products);
  form.reset();
});