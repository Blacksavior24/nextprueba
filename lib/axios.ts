import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL

const formsApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

formsApi.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    }
)

export { formsApi }