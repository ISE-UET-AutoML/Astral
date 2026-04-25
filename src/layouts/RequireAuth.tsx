import { useEffect, useState } from 'react';
import useAuth, { type AuthContextValue } from 'src/features/auth/hooks/useAuth';
import { useLocation, Navigate } from 'react-router-dom';
import Loading from 'src/components/shared/data-display/Loading';
import { Outlet } from 'react-router-dom';

export default function RequireAuth() {
	const { authed, refresh } = useAuth() as AuthContextValue;
	const location = useLocation();

	const [loading, setLoading] = useState(true);

    useEffect(() => {
		const refreshAuth = async () => {
			await refresh();
			setLoading(false);
		};

		refreshAuth();

        return () => {
            setLoading(true);
        };
    }, []);

	if (loading) {
		return <Loading />;
	}

	if (!authed) {
		return (
			<Navigate to="/login" replace state={{ path: location.pathname }} />
		);
	}

	return <Outlet />;
}
