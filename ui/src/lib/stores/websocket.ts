import { writable } from 'svelte/store';

type Event = {
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

    socket.onmessage = (event: Event) => {
        messages.update((msgs) => [...msgs, JSON.parse(event.data)]);
    };

    return {
        subscribe: messages.subscribe,
        onopen: (cb: () => void) => {
            callback = cb;
        },
        send: (event: Event) => {
            socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify(event));
        },
        close: () => {
            socket.close();
        }
    }
}
