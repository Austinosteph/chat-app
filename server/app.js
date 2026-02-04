const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('message', (data) => {
		socket.broadcast.emit('message', data);
	});
	socket.on('typing', (data) => {
		socket.broadcast.emit('user_typing', data);
	});
});

httpServer.listen(5000, () => {
	console.log('node is listening on port 5000');
});
