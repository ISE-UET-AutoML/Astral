import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { toast } from 'sonner';
import { API_BASE_URL } from 'src/constants/api';

// Hook that sets up the socket and listens for incoming notifications
const useNotification = () => {
    useEffect(() => {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken');

        if (!accessToken) {
            console.warn('useNotification: No access token found');
            return;
        }

        // Initialize socket connection
        const socket = io(API_BASE_URL || 'http://localhost:3005', {
            auth: {
                token: accessToken,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        // Listen for notifications
        socket.on('notification', (payload) => {
            console.log('Received notification:', payload);

            // Show notification popup for 5 seconds
            toast.info(payload.message || 'New notification', {
                duration: 5000,
                description: payload.description || '',
            });
        });

        // Connection events
        socket.on('connect', () => {
            console.log('Socket connected successfully');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, []);
};

// Simple context wrapper; value can be extended in future if needed
const NotificationContext = React.createContext<Record<string, never>>({});

export const NotificationProvider = ({ children }: { children?: React.ReactNode }) => {
    useNotification();
    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => React.useContext(NotificationContext);

export default useNotification;
