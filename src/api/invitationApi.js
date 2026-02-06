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

  async fetchInvitations() {
    const { data } = await baseApi.get("/invitation");

    return data;
  },
}; 
