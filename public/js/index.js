const socket = io();
let tabIsActive = false;

socket.on('connect', () => {
  console.log('Connected to the server...');
});

socket.on('disconnect', () => {
  console.log('Disconneted from the server...');
});

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');

  let li = document.createElement('LI');
  li.textContent = `${message.from} ${formattedTime}: ${message.text}`;

  const ol = document.querySelector('#messages');
  ol.appendChild(li);
});

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');

  let li = document.createElement('LI');
  let a = document.createElement('A');

  a.textContent = 'My current location';
  a.setAttribute('target', '_blank');

  li.textContent = `${message.from} ${formattedTime}: `;
  a.setAttribute('href', message.url);

  li.appendChild(a);

  const ol = document.querySelector('#messages');
  ol.appendChild(li);
});

const form = document.querySelector('.message-form');

form.addEventListener('submit', event => {
  event.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: event.target[0].value.trim(),
    },
    () => {
      event.target[0].value = '';
    },
  );
});

const locationButton = document.querySelector('.send-location');
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', true);
  locationButton.textContent = 'Sending location...';

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      locationButton.removeAttribute('disabled');
      locationButton.textContent = 'Send location';
    },
    () => {
      alert('Unable to get location.');
      locationButton.removeAttribute('disabled');
      locationButton.textContent = 'Send location';
    },
  );
});
