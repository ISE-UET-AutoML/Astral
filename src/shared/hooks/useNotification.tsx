import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'universal-cookie';

import { API_BASE_URL } from 'src/constants/api';
import instance from 'src/api/axios';

export type AppNotification = {
    id: string;
    message: string;
    description?: string;
    type?: string;
    metadata?: {
        reviewUrl?: string;
        [key: string]: unknown;
    };
    timestamp: string;
    read: boolean;
};

type NotificationContextValue = {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
};

const normalizeNotification = (payload): AppNotification => ({
    id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message: payload.message || 'New notification',
    description: payload.description || '',
    type: payload.type,
    metadata: payload.metadata || {},
    timestamp: payload.timestamp || payload.created_at || new Date().toISOString(),
    read: Boolean(payload.read ?? payload.is_read),
});

// Hook that sets up the socket and listens for incoming notifications
const useNotification = (onNotification: (payload: AppNotification) => void) => {
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

            const metadata = payload.metadata || {};
            const reviewUrl = metadata.reviewUrl;
            const isDriftNotification = payload.type === 'DRIFT_DETECTED' && reviewUrl;
            const notification: AppNotification = normalizeNotification({
                ...payload,
                metadata,
                read: false,
            });

            onNotification(notification);

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
    }, [onNotification]);
};

const NotificationContext = React.createContext<NotificationContextValue>({
    notifications: [],
    unreadCount: 0,
    markAsRead: async () => undefined,
    markAllAsRead: async () => undefined,
});

export const NotificationProvider = ({ children }: { children?: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const handleNotification = useCallback((notification: AppNotification) => {
        setNotifications((current) => [
            notification,
            ...current.filter((item) => item.id !== notification.id),
        ].slice(0, 50));
    }, []);

    useEffect(() => {
        const loadNotifications = async () => {
            const cookies = new Cookies();
            const accessToken = cookies.get('accessToken');
            if (!accessToken) return;

            try {
                const response = await instance.get(`${API_BASE_URL}/api/service/users/notifications`);
                const loadedNotifications = (response.data.notifications || []).map(normalizeNotification);
                setNotifications(loadedNotifications);
            } catch (error) {
                console.warn('Failed to load notifications:', error);
            }
        };

        loadNotifications();
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
        try {
            await instance.patch(`${API_BASE_URL}/api/service/users/notifications/${id}/read`);
        } catch (error) {
            console.warn('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((current) =>
            current.map((notification) => ({ ...notification, read: true }))
        );
        try {
            await instance.patch(`${API_BASE_URL}/api/service/users/notifications/read-all`);
        } catch (error) {
            console.warn('Failed to mark notifications as read:', error);
        }
    }, []);

    useNotification(handleNotification);

    const value = useMemo(
        () => ({
            notifications,
            unreadCount: notifications.filter((notification) => !notification.read).length,
            markAsRead,
            markAllAsRead,
        }),
        [markAllAsRead, markAsRead, notifications]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => React.useContext(NotificationContext);

export default useNotification;
