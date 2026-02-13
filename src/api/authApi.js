import { baseApi } from "./baseApi";

export const authApi = {
  async checkUserByEmail(email) {
    try {
      const { data } = await baseApi.get("/auth/check-email", {
        params: { email },
      });

      return data.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async register(email, login, password, code) {
    const { data } = await baseApi.post("/auth/register", {
      email,
      login,
      password,
      code,
    });

    localStorage.setItem("token", data.token);

    return data.user;
  },

  async requestResetPassword(email) {
    const {data} = await baseApi.post('/auth/request-reset-password', {email});

    return data;
  },

  async resetPassword(email, code) {
    const {data} = await baseApi.post('/auth/reset-password', {email, code});

    return data;
  },

  async login(email, password) {
    const { data } = await baseApi.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    return data.user;
  },

  async createCode(email) {
    const { data } = await baseApi.post("/auth/create-code", {
      email,
    });

    return data.success;
  },
};
