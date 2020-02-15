[{
      id: 'fdjdslfjlfqsf',
      name: 'Youssef',
      room: 'The office'
}]

class Users {
      constructor() {
            this.users = []
      }
      addUser(id, name, room) {
           var user = {
                 id,
                 name,
                 room
           }
           this.users.push(user)
           return user
      }
      removeUser(id){
            var foundUser = this.users.find((item) => item.id === id);
            if(foundUser){
                  this.users.splice(this.users.indexOf(foundUser), 1);
            }
            return foundUser
      }
      getUser(id){
            // return this.users.filter((user) => user.room === room)
            var foundUser = this.users.find((item) => item.id === id);
            return foundUser;

      }
      getUserList(room){
            var users = this.users.filter((user) => user.room === room);
            var namesArray = users.map((user) => user.name)
            return namesArray;
      }
}

module.exports = {Users}