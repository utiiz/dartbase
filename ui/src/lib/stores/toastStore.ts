import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}

function createToastStore() {
    const { subscribe, update, set } = writable<{
        current: Toast | null;
        queue: Toast[];
    }>({
        current: null,
        queue: []
    });

    const processQueue = () => {
        update(state => {
            if (state.queue.length > 0) {
                const [nextToast, ...remainingQueue] = state.queue;
                return {
                    current: nextToast,
                    queue: remainingQueue
                };
            }
            return { current: null, queue: [] };
        });
    };

    return {
        subscribe,
        show: (message: string, type: ToastType = 'info', duration = 3000) => {
            const id = Date.now();
            update(state => {
                // If no current toast, show immediately
                if (!state.current) {
                    return {
                        current: { id, message, type, duration },
                        queue: []
                    };
                }
                // Otherwise, add to queue
                return {
                    ...state,
                    queue: [...state.queue, { id, message, type, duration }]
                };
            });

            // Schedule removal and process queue
            setTimeout(() => {
                processQueue();
            }, duration);
        },
        remove: () => {
            processQueue();
        }
    };
}

export const toastStore = createToastStore();
