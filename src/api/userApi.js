const {baseApi} = require("./baseApi");

export const userApi = {
    async fetchProfile() {
        const {data} = await baseApi.get("/user");

        return data;
    },

    async changePassword(currentPassword, password) {
        const {data} = await baseApi.put('/user/change-password', {
            currentPassword,
            password,
            refreshToken: localStorage.getItem('refreshToken')
        });

        return data;
    },

    async updateUser(dto) {
        const {data} = await baseApi.put('/user', dto);

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
