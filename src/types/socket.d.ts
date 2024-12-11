import type { Namespace, Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

declare global {
	interface ServerToClientEvents {
		[key: string]: (data: any) => void;
		pong: () => void;
		connected: (address: string | null) => void;
		disconnected: () => void;
		price: ({ market: string, coin: stirng, price: number, country: string }) => void;
	}

	interface ClientToServerEvents {
		[key: string]: (data: any) => void;
		ping: () => void;
		join: (room: string[] | string) => void;
		leave: (room: string[] | string) => void;
		disconnect: () => void;
	}

	interface SocketClient extends Socket<ServerToClientEvents, ClientToServerEvents> {}
	interface NamespaceClient extends Namespace<ClientToServerEvents, ServerToClientEvents> {}

	interface CcxtToServerEvents {
		[key: string]: (data: any) => void;
		join: (market: string) => void;
		leave: (market: string) => void;
		price: ({ market: string, coin: string, price: number, country: string }) => void;
	}
	interface ServerToCcxtEvents {
		[key: string]: (data: any) => void;
	}
	interface SocketCcxt extends Socket<ServerToCcxtEvents, CcxtToServerEvents> {}
	interface NamespaceCcxt extends Namespace<CcxtToServerEvents, ServerToCcxtEvents> {}
}

export {};
