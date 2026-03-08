import { useState, useEffect, useCallback } from 'react';
import { getGenAppsList } from 'src/api/deploy';

/**
 * Hook gọi GET /api/service/adaptive_model_to_app để lấy list app đã gen.
 * Có thể truyền projectId để chỉ lấy app của 1 project.
 * @param {string | null | undefined} projectId
 * @returns {{ apps: any[], loading: boolean, error: Error | null, refetch: () => Promise<void> }}
 */
export function useGenApps(projectId) {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApps = useCallback(async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setError(null);
        try {
            const { data } = await getGenAppsList(projectId);
            console.log('[useGenApps] Raw response:', data);

            if (data?.items) {
                setApps(data.items);
            } else if (Array.isArray(data)) {
                setApps(data);
            } else {
                setApps([]);
            }
        } catch (err) {
            console.error('[useGenApps] Error fetching apps:', err);
            setError(err);
            setApps([]);
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchApps();

            // Set up polling every 1 minute (60000ms)
            const intervalId = setInterval(() => {
                fetchApps(true);
            }, 60000);

            return () => clearInterval(intervalId);
        } else {
            setApps([]);
            setLoading(false);
        }
    }, [fetchApps, projectId]);

    return { apps, loading, error, refetch: fetchApps };
}
