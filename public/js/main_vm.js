
import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function setUserId({sID, message}){
  
    // debugger;
    
   console.log('connected', sID, message);
    vm.socketID = sID;
    
}

function appendMessage(message) {
    vm.messages.push(message);
}


const vm = new Vue({
    data: {
        
        connectedUsers: [],
        socketID: "",
        nickname: "",
        message: "",
        messages: []
    },
    
    created: function (){
        // if server emit user joined, update connectUser array
         socket.on('user joined', function(socketId){
             
             //get already connected users
             axios.get('/onlineusers')
                    .then(function (response) {
                        for(var key in response.data) {
                            if(this.connectedUsers.indexOf(key) <= -1) {
                                this.connectedUsers.push(key);
                     }
                   }
                 console.log(this.connectedUsers); 
             }.bind(this));
             
             
                  var infoMsg = {
                 "type": "info",
                 "msg": "User " + socketId + " has Joined"
             }
             this.messages.push(infoMsg);
            
         }.bind(this));
        
        // if user left then run the array
        
        socket.on('user left', function (socketId) {
                var index = this.connectedUsers.indexOf(socketId);
                if(index >= 0) {
                    this.connectedUsers.splice(index,1);
                    
                
                  var infoMsg = {
                 "type": "info",
                 "msg": "User " + socketId + " has left"
             }
             this.messages.push(infoMsg);    
                
                }
        }.bind(this));
        
        
    },
    
    methods: {
        dispatchMessage() {
            //send a chat message
            
            socket.emit('chat message',{ content: this.message, name: this.nickname || "Anonymous"} );
            
            this.message = "";
        }
    },
    
    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage);