import axios from "axios";
import { APP_URL } from "config";
import { API_URL } from "config";

const api = axios.create({
    baseURL: API_URL
})


let data = JSON.parse(localStorage.getItem('persist:admin-privilege'))
data = JSON.parse(data.auth)


api.interceptors.request.use(async config => {

    if (data.currentUser.token) {
        config.headers.Authorization = `Bearer ${data.currentUser.token}`
    }

    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.data.error === 'Unauthenticated.') {
            window.location.href= `${APP_URL}/login`
        }
    })

export default api