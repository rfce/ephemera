import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  // Only attach token if request has a body (POST / PUT / PATCH)
  if (token && config.data && typeof config.data === "object") {
    config.data = {
      ...config.data,
      token
    }
  }

  return config
})

export default api
