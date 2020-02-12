const path = require('path')
const http = require('http') 
const express = require('express')
const socketIo = require('socket.io')

var {generateMessage} = require('./utils/message')
const app = express()
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const publicPath = path.join(__dirname, '../public')
const io = socketIo(server);
app.use(express.static(publicPath))

io.on('connection', (socket) => {
      console.log('New user connected');
      
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app '));

      socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'))



      socket.on('createMessage', (message, cb) => {
            console.log('createMessage', message); 
            io.emit('newMessage', generateMessage(message.from, message.text)) 
            cb('This is from the server')   
            // socket.broadcast.emit('newMessage', {
            //       from: message.from,
            //       text: message.text,
            //       createAt: new Date().getTime()
            // })
      })

      socket.on('disconnect', (socket) => {
            console.log('Disconnected');
      })
})




server.listen(port, () => {
      console.log(`Listening on port ${port}`)
});


