import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import userStore from "@/stores/userStore";
import api from "@/services/api";

export default function SessionManager() {
    const { getUser, refreshToken } = userStore();
    const [isLoading, setIsLoading] = useState(true);
    const [authCheckComplete, setAuthCheckComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigate) {
            api.setNavigate(navigate);
        }
    }, [navigate]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem("jwt");

                if (token) {
                    await getUser();
                } else {
                    const refreshed = await refreshToken();
                    if (refreshed) {
                        await getUser();
                    }
                }
            } catch (error) {
                return false;
            } finally {
                setIsLoading(false);
                setAuthCheckComplete(true);
            }
        };

        checkAuth();
    }, [getUser, refreshToken]);

    useEffect(() => {
        if (!authCheckComplete) return;

        const tokenCheckInterval = setInterval(async () => {
            const token = sessionStorage.getItem("jwt");

            if (!token && !isLoading) {
                try {
                    await refreshToken();
                } catch (error) {
                    return;
                }
            }
        }, 300000);

        return () => {
            clearInterval(tokenCheckInterval);
        };
    }, [authCheckComplete, isLoading, refreshToken]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    return <Outlet />;
}