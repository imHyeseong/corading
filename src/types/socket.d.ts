declare global {
	interface ServerToClientEvents {}

	interface ClientToServerEvents {
		join: (room: string[] | string) => void;
		leave: (room: string[] | string) => void;
		disconnect: () => void;
	}

	// interface InterServerEvents {
	// 	ping: () => void;
	// }

	// interface SocketData {
	// 	name: string;
	// 	age: number;
	// }
}

export {};
