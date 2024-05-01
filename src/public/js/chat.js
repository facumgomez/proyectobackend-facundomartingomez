const socket = io();

let user;
let chatBox = document.getElementById('chatBox');
let messageLogs = document.getElementById('messageLogs');
let data;

socket.on('message', message => {
  data = message;
});

socket.on('messageLogs', message => {
  rend (message);
});

const rend = (message) => {
  let messages = '';

  message.forEach(message => {
    const isCurrentUser = message.user === user;
    const messageClass = isCurrentUser ? 'myMessage' : 'otherMessage';
    messages = messages + `<div class="${messageClass}">${message.user} : ${message.message}</div>`
  });

  messageLogs.innerHTML = messages;
  chatBox.scrollIntoView(false);
}

Swal.fire({
  title: 'Identifcación',
  input: 'email',
  text: 'Ingresa tu correo electronico',

  inputValidator: (value) => {
    if (!value)
      return 'Debes ingresar tu correo electornico';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value))
    return 'Ingrese un correo electronico valido';
  return null;
  },
  allowOutsideClick: false
}).then(resp => {
  if (resp.isConfirmed){
    user = resp.value;
    rend(message);
  }
});

chatBox.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    if(chatBox.value.trim().length > 0){
      const message = chatBox.value;
      socket.emit('message', { user, message});
      chatBox.value = '';
    }
  }
});

socket.on('nuevoUser', () => {
  Swal.fire({
    text: 'Nuevo usuario conectado',
    toast: true,
    position: 'top-right'
  });
});
