import { io } from 'socket.io-client';

export const socket = io(
	process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
);
socket.on('connect', () => {
	console.log('Connected to server');
});
