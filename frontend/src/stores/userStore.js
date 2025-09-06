import { create } from "zustand";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

console.log("userStore baseURL:", baseURL);

let refreshInProgress = false;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN = 5000;
let jwtToken = null;

const checkCookies = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  if (cookies.length === 0 || (cookies.length === 1 && cookies[0] === "")) {
    return false;
  }

  let refreshTokenFound = false;

  cookies.forEach((cookie) => {
    const [name] = cookie.split("=");

    if (
      name.trim().includes("REFRESH_TOKEN") ||
      name.trim().includes("refresh_token") ||
      name.trim().includes("refreshToken") ||
      name.trim().includes("refresh")
    ) {
      refreshTokenFound = true;
    }
  });

  return refreshTokenFound;
};

const userStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${baseURL}/api/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      jwtToken = response.data.token;

      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });

      refreshInProgress = false;
      lastRefreshAttempt = 0;

      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Échec de la connexion",
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${baseURL}/api/register`, userData, {
        withCredentials: true,
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Échec de l'inscription",
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post(
        `${baseURL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      jwtToken = null;

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      refreshInProgress = false;
      lastRefreshAttempt = 0;
    } catch (error) {
      jwtToken = null;

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      refreshInProgress = false;
      lastRefreshAttempt = 0;
    }
  },

  getUser: async () => {
    if (!jwtToken) {
      set({ loading: false, isAuthenticated: false });
      return null;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${baseURL}/api/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        withCredentials: true,
      });

      set({
        user: response.data,
        isAuthenticated: true,
        loading: false,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshed = await get().refreshToken();
          if (refreshed) {
            const newResponse = await axios.get(`${baseURL}/api/me`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              withCredentials: true,
            });

            set({
              user: newResponse.data,
              isAuthenticated: true,
              loading: false,
            });

            return newResponse.data;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
            return null;
          }
        } catch (refreshError) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
          return null;
        }
      } else {
        set({
          loading: false,
          error:
            error.response?.data?.message ||
            "Impossible de récupérer les informations utilisateur",
        });
        return null;
      }
    }
  },

  refreshToken: async () => {
    if (refreshInProgress) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!refreshInProgress) {
            clearInterval(checkInterval);
            resolve(!!jwtToken);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(false);
        }, 5000);
      });
    }

    const now = Date.now();
    if (now - lastRefreshAttempt < REFRESH_COOLDOWN) {
      return false;
    }

    checkCookies();

    refreshInProgress = true;
    lastRefreshAttempt = now;

    try {
      const response = await axios.post(
        `${baseURL}/api/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      jwtToken = response.data.token;

      if (response.data.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
        });
      } else {
        set({
          isAuthenticated: true,
        });
      }

      refreshInProgress = false;
      return true;
    } catch (error) {
      refreshInProgress = false;
      jwtToken = null;
      set({
        user: null,
        isAuthenticated: false,
      });

      return false;
    }
  },

  checkProfileComplete: async () => {
    try {
      if (!jwtToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await axios.get(
        `${baseURL}/api/user/profile/check-complete`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await get().refreshToken();
        if (refreshed) {
          return get().checkProfileComplete();
        }
      }
      throw error;
    }
  },

  completeProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      if (!jwtToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await axios.put(
        `${baseURL}/api/user/profile/complete`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        }
      );

      set({
        user: { ...get().user, ...response.data.user },
        loading: false,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshed = await get().refreshToken();
          if (refreshed) {
            return get().completeProfile(profileData);
          }
        } catch (refreshError) {}
      }

      set({
        loading: false,
        error:
          error.response?.data?.error ||
          "Erreur lors de la complétion du profil",
      });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      if (!jwtToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await axios.put(
        `${baseURL}/api/user/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        }
      );

      set({
        user: { ...get().user, ...response.data.user },
        loading: false,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshed = await get().refreshToken();
          if (refreshed) {
            return get().updateProfile(profileData);
          }
        } catch (refreshError) {}
      }

      set({
        loading: false,
        error:
          error.response?.data?.error ||
          "Erreur lors de la mise à jour du profil",
      });
      throw error;
    }
  },

  clearErrors: () => set({ error: null }),

  resetState: () => {
    refreshInProgress = false;
    lastRefreshAttempt = 0;
    jwtToken = null;
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },

  debugCookies: () => checkCookies(),
  getToken: () => jwtToken,
}));

export default userStore;
