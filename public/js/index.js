const socket = io();
let tabIsActive = false;

socket.on('connect', () => {
  console.log('Connected to the server...');
});

socket.on('disconnect', () => {
  console.log('Disconneted from the server...');
});

socket.on('newMessage', message => {
  console.log('New message...', message);

  let li = document.createElement("LI");
  li.textContent = `${message.from}: ${message.text}`;

  const ol = document.querySelector('#messages');
  ol.appendChild(li);

  if (!tabIsActive && isNotificationsEnabled) {
    const title = `Message from ${message.from}`
    const notificationOptions = {
      body: message.text
    };
    const notification = new Notification(title, notificationOptions);
  }
});

socket.on('newLocationMessage', message => {
  let li = document.createElement("LI");
  let a = document.createElement("A");

  a.textContent = 'My current location';
  a.setAttribute('target', '_blank');

  li.textContent = `${message.from}: `;
  a.setAttribute('href', message.url);

  li.appendChild(a);

  const ol = document.querySelector('#messages');
  ol.appendChild(li);
});

const form = document.querySelector('.message-form');

form.addEventListener('submit', event => {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: event.target[0].value.trim()
  }, () => {
    event.target[0].value = '';
  });
});

const locationButton = document.querySelector('.send-location');
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    alert('Unable to get location.');
  });
});

const isNotificationsEnabled = () => {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    return true;
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        return true;
      }
    });
  }
};

window.addEventListener('focus', () => { 
  tabIsActive = true;
});

window.addEventListener('blur', () => { 
  tabIsActive = false;
});