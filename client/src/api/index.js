import axios from "axios";

const instance = axios.create({
  baseURL: process.env.API_URL,
});

// TODO
// instance.interceptors.request.use(async config => {
//   const token = get token from cookies (might not need to do it manually)
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default instance;
