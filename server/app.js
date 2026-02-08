const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: 'https://chat-app-plum-two.vercel.app',
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

let onlineUsers = {};

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);

	// When a user comes online
	socket.on('user_online', (username) => {
		if (!onlineUsers[username]) {
			onlineUsers[username] = [];
			socket.broadcast.emit('user_status', { username, status: 'online' });
		}

		onlineUsers[username].push(socket.id);
	});

	// When a user disconnects
	socket.on('disconnect', () => {
		let disconnectedUser = null;

		for (let [username, sockets] of Object.entries(onlineUsers)) {
			const index = sockets.indexOf(socket.id);
			if (index !== -1) {
				sockets.splice(index, 1);

				if (sockets.length === 0) {
					disconnectedUser = username;
					delete onlineUsers[username];
					socket.broadcast.emit('user_status', { username, status: 'offline' });
				}
				break;
			}
		}
	});

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
