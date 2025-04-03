import { writable } from 'svelte/store';

type Message = {
	type: string;
	data: any;
};

export function createWebsocketStore() {
	const socket = new WebSocket('ws://127.0.0.1:8090/ws');
	const messages = writable<string[]>([]);
	let callbackonopen = () => {};
	let callbackonmessage = (message) => {};

	socket.onopen = () => {
		callbackonopen();
	};

	socket.onmessage = (message: Message) => {
		callbackonmessage(message);
	};

	return {
		subscribe: messages.subscribe,
		onopen: (cb: () => void) => {
			callbackonopen = cb;
		},
		onmessage: (cb: (message: Message) => void) => {
			callbackonmessage = cb;
		},
		send: (message: Message) => {
			socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify(message));
		},
		close: () => {
			socket.close();
		}
	};
}
