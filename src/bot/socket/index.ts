import { Server } from 'socket.io';
import http from 'http';
const server = http.createServer();

import 'dotenv/config';
import { subscriber } from '$redis/redis';

const io = new Server(server, {
	cors: {
		origin: '*'
	},
	transports: ['websocket']
});

const client: NamespaceClient = io.of('/client');

const txManager = io.of('/txManager');

client.on('connection', (socket) => {
	console.log('client connected');

	const join = (rooms: string[] | string) => {
		if (Array.isArray(rooms)) {
			rooms.forEach((room) => {
				socket.join(room);
			});
		} else {
			socket.join(rooms);
		}
	};

	const leave = (rooms: string[] | string) => {
		if (Array.isArray(rooms)) {
			rooms.forEach((room) => {
				socket.leave(room);
			});
		} else {
			socket.leave(rooms);
		}
	};

	socket.on('join', (data) => {
		join(data);
		console.log('client join', data);
	});

	socket.on('leave', (data) => {
		leave(data);
		console.log('client leave', data);
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
		socket.emit('disconnected');
		socket.rooms.forEach((room) => {
			socket.leave(room);
		});
	});
});

subscriber.subscribe('price', (message) => {
	const data = JSON.parse(message);

	const room = `price:${data.market}`;
	const event = `${data.market}:${data.coin}`;

	client.in(room).emit(event, data);
});
server.listen(8888, process.env.PUBLIC_BASE_IP, () => {
	console.log(`server listening on ${process.env.PUBLIC_BASE_URL}:8888`);
});
