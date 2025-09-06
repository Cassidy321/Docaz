import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 2;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const { default: userStore } = await import("../stores/userStore");
    const token = userStore.getState().getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/refresh-token")
    ) {
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        refreshAttempts = 0;
        return Promise.reject(error);
      }

      const requiresStrictAuth =
        originalRequest.url.includes("/api/me") ||
        originalRequest.url.includes("/api/annonce/creation") ||
        originalRequest.url.includes("/post/update/") ||
        originalRequest._requiresAuth === true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      refreshAttempts++;

      try {
        const { default: userStore } = await import("../stores/userStore");

        const refreshed = await userStore.getState().refreshToken();

        if (refreshed) {
          const token = userStore.getState().getToken();
          processQueue(null, token);
          refreshAttempts = 0;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          isRefreshing = false;
          return api(originalRequest);
        } else {
          processQueue(new Error("Échec de la récupération du token"));
          isRefreshing = false;

          if (requiresStrictAuth) {
            setTimeout(() => {
              navigate("/connexion");
            }, 100);
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (
          originalRequest.url.includes("/api/me") ||
          originalRequest.url.includes("/api/annonce/creation") ||
          originalRequest.url.includes("/post/update/")
        ) {
          setTimeout(() => {
            navigate("/connexion");
          }, 100);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

let navigate = null;

api.setNavigate = (navigateFunction) => {
  navigate = navigateFunction;
};

api.requireAuth = (config = {}) => {
  return {
    ...config,
    _requiresAuth: true,
  };
};

export default api;
