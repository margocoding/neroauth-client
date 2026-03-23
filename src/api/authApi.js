import { AxiosError } from "axios";
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

    localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
    localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

    return data.user;
  },
  async resetPassword(email, code, password) {
    const { data } = await baseApi.post("/auth/reset-password", {
      email,
      code,
      password,
    });

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
    }

    return data;
  },

  async login(email, password) {
    const { data } = await baseApi.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
    localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

    return data.user;
  },

  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  async fetchSessions() {
    const { data } = await baseApi.get("/session");

    return data;
  },

  async closeSession(id) {
    const { data } = await baseApi.delete(`/session/close/${id}`);

    return data;
  },

  async closeAllSessions() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return Error("Token not found");
    const { value } = JSON.parse(refreshToken);
    const { data } = await baseApi.delete("/session/close", {
      data: { refreshToken: value },
    });

    return data;
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Error("Token not found");
      const { value } = JSON.parse(refreshToken);

      const { data } = await baseApi.post("/auth/refresh", {
        refreshToken: value,
      });
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

      return data.user;
    } catch (e) {
      console.error(e);
      throw new AxiosError("Unauthorized", 401);
    }
  },

  async createCode(email) {
    const { data } = await baseApi.post("/auth/create-code", {
      email,
    });

    return data.success;
  },
};
