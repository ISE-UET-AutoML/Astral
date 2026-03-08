import { useState, useEffect, useCallback } from 'react';
import { getGenAppsList } from 'src/api/deploy';

/**
 * Hook gọi GET /api/service/adaptive_model_to_app để lấy list app đã gen.
 * Có thể truyền projectId để chỉ lấy app của 1 project.
 * @param {string | null | undefined} projectId
 * @param {number} initialPage
 * @param {number} limit
 * @returns {{ apps: any[], loading: boolean, error: Error | null, total: number, page: number, setPage: (page: number) => void, refetch: () => Promise<void> }}
 */
export function useGenApps(projectId, initialPage = 1, limit = 8) {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);

    const fetchApps = useCallback(async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setError(null);
        try {
            const offset = (page - 1) * limit;
            const { data } = await getGenAppsList(projectId, limit, offset);
            console.log('[useGenApps] Raw response:', data);

            if (data?.items) {
                setApps(data.items);
                setTotal(data.total || 0);
            } else if (Array.isArray(data)) {
                setApps(data);
                setTotal(data.length);
            } else {
                setApps([]);
                setTotal(0);
            }
        } catch (err) {
            console.error('[useGenApps] Error fetching apps:', err);
            setError(err);
            setApps([]);
            setTotal(0);
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [projectId, page, limit]);

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
            setTotal(0);
            setLoading(false);
        }
    }, [fetchApps, projectId]);

    return { apps, loading, error, total, page, setPage, refetch: fetchApps };
}
