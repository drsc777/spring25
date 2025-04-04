const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String },
  timestamp: { type: Date, default: Date.now }
})

const messageModel = mongoose.model("Message", messageSchema)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Route for chat history page
app.get('/history', (req, res) => {
  res.sendFile(__dirname + '/history.html');
});

app.get('/messages', async function(req, res){
  res.json(await messageModel.find());
});

io.on('connection', function(socket){
  console.log('User connected');
  
  // Send history messages
  messageModel.find().sort({ timestamp: -1 }).limit(10).then(messages => {
    socket.emit('load messages', messages.reverse());
  }).catch(error => {
    console.error('Error loading messages:', error);
  });
  
  socket.on('chat message', function(msg){
    const message = new messageModel();
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg);
    })
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://sam:helloworld@cluster0.ytnrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  console.log('listening on *:3000');
});