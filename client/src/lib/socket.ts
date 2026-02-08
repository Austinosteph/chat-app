import { io } from 'socket.io-client';

export const socket = io(
	process.env.NEXT_PUBLIC_SOCKET_URL || 'https://chat-app-jmca.onrender.com',
);
socket.on('connect', () => {
	console.log('Connected to server');
});
