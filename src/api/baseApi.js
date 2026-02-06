import axios from "axios";

export const baseApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

baseApi.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");

  if (token) {
    request.headers.Authorization = "Bearer " + token;
  }

  return request;
});

baseApi.interceptors.response.use((response) => {
  if (response.status === 401) localStorage.removeItem("token");
  return response;
});
