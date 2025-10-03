// adminApi.js
import axios from "axios"
import { getAccessToken, getRefreshToken, logout, setAccessToken } from "../utils/token-service"
// import { getAdminToken, getAdminRefresh, setAdminToken, logoutAdmin } from "../utils/token-service"

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

adminApi.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers["x-Admin-Token"] = token
  }
  return config
})

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = getRefreshToken()
        if (!refresh) throw new Error("No admin refresh token")

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { refreshToken: refresh })
        const newToken = response.data.accessToken
        setAccessToken(newToken)
        originalRequest.headers["x-Admin-Token"] = newToken
        return adminApi(originalRequest)
      } catch (err) {
        logout()
      }
    }
    return Promise.reject(error)
  }
)

export default adminApi
