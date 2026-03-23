import axios from "axios";
import { authApi } from "./authApi";

export const baseApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

baseApi.interceptors.request.use((request) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        const formattedToken = JSON.parse(token);
        request.headers.Authorization = "Bearer " + formattedToken.value;
    } 


    return request;
});

baseApi.interceptors.response.use(async (response) => response, async (error) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');


    if (error.response.status === 401 && !error.response._tried && refreshToken) {
        error.response._tried = true;
        const data = await authApi.refreshToken();
        

        if(!data) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } else {
            return await baseApi(error.config);
        }
    }

        return Promise.reject(error);
});
