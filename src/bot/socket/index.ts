import { Server } from 'socket.io';
import eiows from 'eiows';

const io = new Server<ClientToServerEvents, ServerToClientEvents>(8888, {
	wsEngine: eiows.Server,
	cors: {
		origin: '*'
	},
	transports: ['websocket'],
	connectTimeout: 10000,
	pingTimeout: 5000
});

const client = io.of('/client');

client.on('connection', (socket) => {
	console.log('client connected');

	socket.on('join', (data: any) => {
		socket.join(data.room);
	});

	socket.on('leave', (data: any) => {
		socket.leave(data.room);
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
		socket.rooms.forEach((room) => {
			socket.leave(room);
		});
	});
});
