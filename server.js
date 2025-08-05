const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    const io = new Server(server);

    // Socket.io logic
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('offer', (offer) => {
            socket.broadcast.emit('offer', offer);
        });
    
        socket.on('answer', (answer) => {
            socket.broadcast.emit('answer', answer);
        });
    
        socket.on('ice-candidate', (candidate) => {
            socket.broadcast.emit('ice-candidate', candidate);
        });

        socket.on('joinRoom', (roomId, callback) => {
            try {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
                callback({ success: true });
            } catch (error) {
                callback({ error: 'Failed to join room' });
            }
        });

        socket.on('send-group-message',(data)=>{
            console.log(data)
            socket.to(data.roomName).emit('recive-group-message',data);
        })

        socket.on('createRoom', (roomId, callback) => {
            socket.join(roomId); // Socket joins the created room
            callback({ success: true, socketId: socket.id });
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });


    });

    // All other requests are handled by Next.js
    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server is running on http://localhost:3000');
    });
});
