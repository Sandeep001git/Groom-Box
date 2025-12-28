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
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    const pendingRequests = {}; // { requestId: { socketId, roomId, username } }

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // ===== Create Room =====
        socket.on('createRoom', (roomId, callback) => {
            socket.join(roomId);
            callback({ success: true, socketId: socket.id });
        });

        // ===== Public Join =====
        socket.on('joinRoom', (roomId, callback) => {
            try {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
                callback({ success: true });
            } catch (error) {
                callback({ error: 'Failed to join room' });
            }
        });

        // ===== Private Join Request =====
        socket.on('requestJoin', (requestId, roomId, username) => {
            pendingRequests[requestId] = {
                socketId: socket.id,
                roomId,
                username
            };
            console.log(`Join request from ${username} for room ${roomId}`);
            io.to(roomId).emit('joinRequest', { requestId, username });
        });

        // ===== Accept Join =====
        socket.on('acceptRequest', (requestId) => {
            const request = pendingRequests[requestId];
            if (request) {
                const { socketId, roomId, username } = request;
                io.to(socketId).emit('requestAccepted', { roomId, username });
                console.log(`Request accepted for ${username} in room ${roomId}`);
                delete pendingRequests[requestId];
            } else {
                console.log(`No pending request found for ID: ${requestId}`);
            }
        });

        // ===== Reject Join =====
        socket.on('rejectJoin', (requestId) => {
            const request = pendingRequests[requestId];
            if (request) {
                const { socketId, username } = request;
                io.to(socketId).emit('requestRejected', { username });
                console.log(`Request rejected for ${username}`);
                delete pendingRequests[requestId];
            } else {
                console.log(`No pending request found for ID: ${requestId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

    // Let Next.js handle all other requests
    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server running on http://localhost:3000');
    });
});
