import { browser } from '$app/environment';
import { readable, derived } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';
import pb from '$lib/pocketbase';

// Create a readable store for connection status
export const connectionStatus = readable({ connected: false, lastChecked: null }, (set) => {
    let timer = null;
    let mounted = false;

    // Function to check connection
    const checkConnection = async () => {
        try {
            console.log(pb);
            const uuid = pb.authStore.model?.settings?.dartboard || '';
            const response = await fetch(`${pb.baseURL}/api/v1/dartboard/${uuid}`); // Adjust this URL to your endpoint
            const data = await response.json();
            set({ connected: data.connected, lastChecked: new Date() });
        } catch (error) {
            console.error('Connection check failed:', error);
            set({ connected: false, lastChecked: new Date() });
        }
    };

    // Only run in browser environment
    if (browser) {
        mounted = true;
        // Initial check
        checkConnection();

        // Set up interval (e.g., every 30 seconds)
        timer = setInterval(checkConnection, 60000);
    }

    // Cleanup function
    return () => {
        if (mounted && timer) {
            clearInterval(timer);
        }
    };
});

// Convenience derived store if you just need the boolean
export const isConnected = derived(connectionStatus, $status => $status.connected);
