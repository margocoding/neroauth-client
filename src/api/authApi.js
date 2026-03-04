import {baseApi} from "./baseApi";

export const authApi = {
    async checkUserByEmail(email) {
        try {
            const {data} = await baseApi.get("/auth/check-email", {
                params: {email},
            });

            return data.success;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    async register(email, login, password, code) {
        const {data} = await baseApi.post("/auth/register", {
            email,
            login,
            password,
            code,
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data.user;
    },
    async resetPassword(email, code, password) {
        const {data} = await baseApi.post('/auth/reset-password', {email, code, password});

        if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        }


        return data;
    },

    async login(email, password) {
        const {data} = await baseApi.post("/auth/login", {
            email,
            password,
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data.user;
    },

    async logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    async fetchSessions() {
        const {data} = await baseApi.get('/session');

        return data;
    },

    async closeSession(id) {
        const {data} = await baseApi.delete(`/session/close/${id}`);

        return data;
    },

    async closeAllSessions() {
        const {data} = await baseApi.delete('/session/close', {data: {refreshToken: localStorage.getItem('refreshToken')}});

        return data;
    },

    async refreshToken() {
        const {data} = await baseApi.post('/auth/refresh', {refreshToken: localStorage.getItem('refreshToken')});
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data.user;
    },

    async createCode(email) {
        const {data} = await baseApi.post("/auth/create-code", {
            email,
        });

        return data.success;
    },
};
