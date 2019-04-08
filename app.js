// initialize an express app and set it up
const express = require('express');
const app = express();
const io = require('socket.io')();

//some config stuff
const port = process.env.PORT || 3000;

//tell our app to use the public folder for static files
app.use(express.static('public'));

//intialize only route we need
app.get('/', (req, res, next)=>{
    res.sendFile(__dirname + '/views/index.html');
});

// create server variable for socket io
const server = app.listen(port, () =>{
  console.log(`app is running on port ${port}`);
})

// this is server side code to get all the online users 
app.get('/onlineusers', function(request,response) {
  //  console.log(io.socket.adapter.rooms);
     response.send(io.sockets.adapter.rooms);
    
});



// plug in the chat app package

// switch for operator, listen incoming connection
io.attach(server);

io.on('connection', function(socket){
   console.log('a user has connected'); 
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'});
    
    // tell everyone that someone is connected
    io.emit('user joined', socket.id)
    
    //listen for incoming messages and send them to everyone
    socket.on('chat message', function(msg){
        // check the message contents
        console.log('message', msg, 'socket', socket.id);
        
        //send a message to every connected client
        io.emit('chat message', { id: `${socket.id}`, message: msg });
    });
    
    socket.on('disconnect', function(){
       console.log('a user has disconnected'); 
        
            
     // tell everyone that someone is disconnected
     socket.broadcast.emit('user left', socket.id);
    });
});

























