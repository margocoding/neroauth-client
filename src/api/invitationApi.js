import { baseApi } from "./baseApi";

export const invitationApi = {
  async createInvite(code) {
    const { data } = await baseApi.post("/invitation/", { code });

    return data;
  },

  async applyInvitation(id) {
    const { data } = await baseApi.post(`/invitation/apply/${id}`);

    return data;
  },

  async dismissInvitation(id) {
    const { data } = await baseApi.post(`/invitation/dismiss/${id}`);

    return data;
  },

  async fetchInvitations({ page, pageSize }) {
    const { data } = await baseApi.get("/invitation", {
      params: { page, pageSize },
    });

    return data;
  },
};
