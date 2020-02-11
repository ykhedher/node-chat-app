var socket = io();
socket.on('connect', () => {
      console.log('Connected to the server');

      socket.emit('createMessage', {
            from: 'Julia',
            text: 'How are you ?'
      });
});

socket.on('disconnect', () => {
      console.log('Disconnected from server')
});

socket.on('createMessage', (message) => {
      console.log('New message', message)
}) 