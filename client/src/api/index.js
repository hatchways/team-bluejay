import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "/api",
});

instance.interceptors.request.use(async (config) => {
  config.headers.common["X-CSRF-TOKEN"] = Cookies.get("csrf_access_token");
  return config;
});

//we can add global error handling here
instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
