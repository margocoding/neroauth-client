import axios from "axios";
import i18n from 'i18next';
import { languages } from "../i18n/i18n";
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

    request.params = {...request.params, locale: languages.includes(i18n.language) ? i18n.language : 'en'};

    return request;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

baseApi.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refreshToken');

        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            refreshToken &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return baseApi(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const data = await authApi.refreshToken();

                if (!data) {
                    processQueue(new Error('Refresh token error'));
                    return Promise.reject(error);
                }

                processQueue(null);
                return baseApi(originalRequest);
            } catch (e) {
                const refreshStatus = e.response?.status;
                processQueue(e);
                if (refreshStatus && refreshStatus >= 500) {
                    return Promise.reject(e);
                }
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
});
