const socket = io();

const scrollToBottom = () => {
  // Selectors
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');

  // Height
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.scrollTop();
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight(); 

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  console.log('Connected to the server...');
});

socket.on('disconnect', () => {
  console.log('Disconneted from the server...');
});

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');

  const template = document.querySelector('#message-template').innerHTML;
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');

  const template = document.querySelector('#location-message-template').innerHTML;
  let html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
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
