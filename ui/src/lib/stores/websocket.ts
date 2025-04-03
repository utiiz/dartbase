import { writable } from 'svelte/store';

type Message = {
    type: string;
    data: any;
}

export function createWebsocketStore() {
    const socket = new WebSocket('ws://127.0.0.1:8090/ws');
    const messages = writable<string[]>([]);
    let callback = () => { };

    socket.onopen = () => {
        callback();
    };

    socket.onmessage = (message: Message) => {
        console.log(message);
        messages.update((msgs) => [...msgs, JSON.parse(message.data)]);
    };

    return {
        subscribe: messages.subscribe,
        onopen: (cb: () => void) => {
            callback = cb;
        },
        send: (message: Message) => {
            socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify(message));
        },
        close: () => {
            socket.close();
        }
    }
}
