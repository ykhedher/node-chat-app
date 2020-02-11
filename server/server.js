const path = require('path')
const http = require('http') 
const express = require('express')
const socketIo = require('socket.io')

const app = express()
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const publicPath = path.join(__dirname, '../public')
const io = socketIo(server);
app.use(express.static(publicPath))

io.on('connection', (socket) => {
      console.log('New user connected');

      socket.emit('createMessage', {
            from: 'Youssef',
            text: 'Hello Socket',
            createAt: '2020'
      });

      socket.on('createMessage', (newMessage) => {
            newMessage.createAt = new Date();
            console.log('createMessage', newMessage)
      })

      socket.on('disconnect', (socket) => {
            console.log('Disconnected');
      })
})




server.listen(port, () => {
      console.log(`Listening on port ${port}`)
});


