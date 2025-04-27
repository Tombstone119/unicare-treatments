/* eslint-disable @typescript-eslint/no-explicit-any */
// import { auth } from "@/utils/auth";

// import { signIn } from "@/utils/auth";
import { BACKEND_URL } from "@/utils/common";
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

// import { handleAuthFailure, updateNextAuthSession } from "./update-session";

// const getSessionSafe = async () => {
//   if (typeof window !== "undefined") {
//     try {
//       const test = await getSession();
//       return test;
//     } catch (error) {
//       console.error("Error getting client-side session:", error);
//       return null;
//     }
//   } else {
//     // Server-side: Return null or implement server-side session retrieval
//     // For example, you could use cookies().get() to access the session cookie
//     return null;
//   }
// };

// --------------------------------------------------------------------------------
// Create base API instance
const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store the current token in memory
let cachedToken: string | null = null;

// Function to get token, only calling getSession() when necessary
const getAuthToken = async (): Promise<string | null> => {
  if (cachedToken) return cachedToken;

  try {
    const session = await getSession();
    cachedToken = session?.user?.accessToken || null;
    return cachedToken;
  } catch (error) {
    console.error("Error getting session token:", error);
    return null;
  }
};

// --------------------------------------------------------------------------------
// Add a request interceptor to attach the token
api.interceptors.request.use(
  async (request) => {
    const token = await getAuthToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// const clearCachedToken = (): void => {
//   cachedToken = null;
// };

// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value: unknown) => void;
//   reject: (reason?: any) => void;
// }> = [];

// const processQueue = (error: any = null) => {
//   failedQueue.forEach((request) => {
//     if (error) {
//       request.reject(error);
//     } else {
//       request.resolve(true);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => {
//     console.log("responsessssss: =-->", response);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite retry loops
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 403) {
//       if (isRefreshing) {
//         // Queue this request to be retried after refresh completes
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       // Mark as retrying to prevent loops
//       originalRequest._retry = true;
//       isRefreshing = true;
//       try {
//         // Clear cached token
//         clearCachedToken();

//         // Attempt to sign in again
//         const result = await signIn("credentials", { redirect: false });

//         if (result?.error) {
//           throw new Error(result.error);
//         }

//         // Process all queued requests
//         processQueue();

//         // Return the original request with fresh auth
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, reject all queued requests
//         processQueue(refreshError);
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// --------------------------------------------------------------------------------
// Add a response interceptor to handle token refresh

// let isRefreshing = false;
// const failedQueue: Array<{
//   resolve: (value: unknown) => void;
//   reject: (reason?: any) => void;
// }> = [];

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const session = await getSession();
//         if (!session?.user.refreshToken)
//           throw new Error("No refresh token available");

//         const { data } = await axios.post(`${BASE_URL}/users/refreshToken`, {
//           refreshToken: session.user.refreshToken,
//         });

//         await updateNextAuthSession(data.accessToken, data.refreshToken);

//         // Update the authorization header
//         api.defaults.headers.common["Authorization"] =
//           `Bearer ${data.accessToken}`;
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

//         // Process queue
//         failedQueue.forEach((request) => request.resolve(api(originalRequest)));
//         failedQueue = [];
//         return api(originalRequest);
//       } catch (error) {
//         failedQueue.forEach((request) => request.reject(error));
//         failedQueue = [];
//         await handleAuthFailure();
//         return Promise.reject(error);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// --------------------------------------------------------------------------------
// Export simplified service methods

export const apiService = {
  get: async <T = any>(url: string, config = {}): Promise<T> =>
    (await api.get<T>(url, config)).data,

  post: async <T = any>(url: string, data?: any, config = {}): Promise<T> =>
    (await api.post<T>(url, data, config)).data,

  put: async <T = any>(url: string, data?: any, config = {}): Promise<T> =>
    (await api.put<T>(url, data, config)).data,

  delete: async <T = any>(url: string, config = {}): Promise<T> =>
    (await api.delete<T>(url, config)).data,
};

export default api;
