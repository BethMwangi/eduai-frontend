import axios from "axios"
import { getSession } from "next-auth/react"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession()
          console.log("API Request:", {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        hasSession: !!session,
        hasToken: !!session?.accessToken,
        tokenPrefix: session?.accessToken ? session.accessToken.substring(0, 15) + '...' : null
      });
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
      return config
    } catch (error) {
      console.error("Error setting auth header:", error)
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Trigger NextAuth to refresh the token
        const session = await getSession()
        if (session?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)


export const getApiUrl = (endpoint: string): string => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (process.env.NEXT_PUBLIC_API_URL?.includes('/api/v1')) {
    // Don't add /api/v1 if it's already in the path
    if (path.startsWith('/api/v1/')) {
      // Strip out the duplicate /api/v1 prefix
      return path.replace('/api/v1', '');
    }
  }
  
  return path;
};

export default api
