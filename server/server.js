const path = require('path')
const http = require('http') 
const express = require('express')
const socketIo = require('socket.io')


var {generateMessage} = require('./utils/message')
var {realString} = require('./utils/validation')
const {Users} = require('./utils/users')
const app = express()
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const publicPath = path.join(__dirname, '../public')
const io = socketIo(server);

var users = new Users();

app.use(express.static(publicPath))

io.on('connection', (socket) => {
      socket.on('join', (params, cb) => {
            if (!realString(params.name) || !realString(params.room)){
                 return cb('Name and room name are required')
            }
            socket.join(params.room)
            users.removeUser(socket.id)
            users.addUser(socket.id, params.name, params.room)

            io.to(params.room).emit('updateUserList', users.getUserList(params.room))
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app '));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`))
            cb()
      })

      socket.on('createMessage', (message, cb) => {
            var user = users.getUser(socket.id)

            if(user){
                  io.to(user.room).emit('newMessage', generateMessage(user.name,  message.text)) 
            }
            cb('This is from the server')   
            // socket.broadcast.emit('newMessage', {
            //       from: message.from,
            //       text: message.text,
            //       createAt: new Date().getTime()
            // })
      })

      socket.on('disconnect', () => {
            var user = users.removeUser(socket.id)
            if(user){
                  io.to(user.room).emit('updateUserList', users.getUserList(user.room))
                  io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
            }
      })
})
server.listen(port, () => {
      console.log(`Listening on port ${port}`)
});


