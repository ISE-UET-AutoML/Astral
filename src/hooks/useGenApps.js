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

    const fetchApps = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getGenAppsList(projectId);
            console.log('[useGenApps] Raw response:', data);
            
            // Backend  { items: [...], total: number }
            if (data?.items) {
                //console.log('[useGenApps] Found items array:', data.items.length, 'apps');
                setApps(data.items);
            } else if (Array.isArray(data)) {
                //console.log('[useGenApps] Data is array:', data.length, 'apps');
                setApps(data);
            } else {
                //console.warn('[useGenApps] Unexpected response format:', data);
                setApps([]);
            }
        } catch (err) {
            console.error('[useGenApps] Error fetching apps:', err);
            setError(err);
            setApps([]);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        // Chỉ gọi khi đã có projectId 
        if (projectId) {
            fetchApps();
        } else {
            // Nếu không có projectId thì coi như không có app
            setApps([]);
            setLoading(false);
        }
    }, [fetchApps, projectId]);

    return { apps, loading, error, refetch: fetchApps };
}
