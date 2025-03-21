const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const Message = require('./models/message');

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://abbyzyl777:helloworld@cluster0.g8ppq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('User connected');

  // Send history messages
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(10);
    socket.emit('load messages', messages.reverse());
  } catch (error) {
    console.error('Error loading messages:', error);
  }

  // Handle new messages
  socket.on('chat message', async (msg) => {
    try {
      // Save message to database
      const message = new Message({ content: msg });
      await message.save();
      
      // Broadcast message to all clients
      io.emit('chat message', msg);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
