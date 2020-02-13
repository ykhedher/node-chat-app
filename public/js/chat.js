var socket = io();
const scrollToBottom = () => {
      console.log('I\'m working')
      //Selectors
      var messages = jQuery('#messages')
      var newMessage = messages.children('li:last-child')
      //Heights
      var clientHeight = messages.prop('clientHeight');
      var scrollTop = messages.prop('scrollTop');
      var scrollHeight = messages.prop('scrollHeight')
      var newMessageHeight = newMessage.innerHeight();
      var lastMessageHeight = newMessage.prev().innerHeight()

      if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
            messages.scrollTop(scrollHeight)
      } 
}
socket.on('connect', () => {
      var params = jQuery.deparam(window.location.search);

      socket.emit('join', params, (err) => {
            if (err){
                  alert(err)
                  window.location.href = '/'
            }
            else {
                  console.log('No error')
            }
      })

});

socket.on('disconnect', () => {
      console.log('Disconnected from server')
});

socket.on('newMessage', (message) => {
      var formatedTime = moment(message.createdAt).format('h:mm a')
      var template = jQuery('#message-template').html();
      var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createdAt: formatedTime
      });
      jQuery('#messages').append(html);
      scrollToBottom()
      // var formatedTime = moment(message.createdAt).format('h:mm a')
      // var li = jQuery('<li></li>');
      // li.text(`${message.from} ${formatedTime}: ${message.text}`);

      // jQuery('#messages').append(li);
}) 



var messageTextbox = jQuery('[name=message]')
var send = jQuery('#send')
send.prop('disabled', true);

if(messageTextbox.val().length !== 0){
      send.prop('disabled', false);
}

const isEmpty = () => {
      if(messageTextbox.val()){
            send.prop('disabled', false);
      }
      else {
            send.prop('disabled', true);
      }
}
messageTextbox.on('keyup', isEmpty)

jQuery('#message-form').on('submit', (e) => {
      e.preventDefault();
      send.prop('disabled', true);

      socket.emit('createMessage', {
            from: 'User',
            text: messageTextbox.val()
      }, () => {
            messageTextbox.val('');
      })
})
