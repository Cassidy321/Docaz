import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import userStore from "@/stores/userStore";
import api from "@/services/api";
import LoadingScreen from "./components/LoadingScreen";

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
        return <LoadingScreen message="Chargement..." />;
    }

    return <Outlet />;
}