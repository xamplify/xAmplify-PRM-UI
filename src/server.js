const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 4200;

app.use(express.static(path.join(__dirname, '../xtremandApp')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../xtremandApp/index.html'));
});

const server = http.createServer(app);

const io = socketIO(server);

let numberOfOnlineUsers = 0;

io.on('connection', (socket) => {
    console.log(socket);
    numberOfOnlineUsers++;
    io.emit('numberOfOnlineUsers', numberOfOnlineUsers);

    console.log('New user connected');

    socket.on('disconnect', () => {
        numberOfOnlineUsers--;
        io.emit('numberOfOnlineUsers', numberOfOnlineUsers);
        console.log('User disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});