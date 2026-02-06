const { baseApi } = require("./baseApi");

export const userApi = {
  async fetchProfile() {
    const { data } = await baseApi.get("/user");

    return data;
  },

  async addFriend(code) {
    const { data } = await baseApi.post("/user/");

    return data;
  },

  async fetchFriends(id) {
    const { data } = await baseApi.get(`/user/${id}/friends`);

    return data;
  },

  async deleteFriend(id) {
    const { data } = await baseApi.delete(`/user/friend/${id}`);

    return data;
  },
};
 