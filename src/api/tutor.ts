// teacherApi.js
import axios from "axios"
import { getAccessToken, getRefreshToken, logout, setAccessToken } from "../utils/token-service"

const teacherApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

teacherApi.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers["x-teacher-token"] = token
  }
  return config
})

teacherApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = getRefreshToken()
        if (!refresh) throw new Error("No teacher refresh token")

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { refreshToken: refresh })
        const newToken = response.data.accessToken
        setAccessToken(newToken)
        originalRequest.headers["x-teacher-token"] = newToken
        return teacherApi(originalRequest)
      } catch (err) {
        logout()
      }
    }
    return Promise.reject(error)
  }
)

export default teacherApi
