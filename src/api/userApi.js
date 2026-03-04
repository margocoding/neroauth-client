const {baseApi} = require("./baseApi");

export const userApi = {
    async fetchProfile() {
        const {data} = await baseApi.get("/user");

        return data;
    },

    async addFriend(code) {
        const {data} = await baseApi.post("/user/");

        return data;
    },

    async fetchFriends(id) {
        const {data} = await baseApi.get(`/user/${id}/friends`);

        return data;
    },

    async deleteFriend(id) {
        const {data} = await baseApi.delete(`/user/friend/${id}`);

        return data;
    },

    async addAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);
        const {data} = await baseApi.post("/user/upload-avatar", formData);

        return data;
    },

    async deleteAvatar() {
        const {data} = await baseApi.delete('/user/avatar');

        return data;
    }
};
