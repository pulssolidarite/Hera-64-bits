import axios from "axios";
import jwt from "./jwt";
import store from "../store/index";
import router from "../router";

export default {
  createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Return any error which is not due to authentication back to the calling service
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        // if coming from Login.vue
        if (error.config.url.includes("/auth/token/")) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        // Logout user if token refresh didn't work or user is disabled
        if (error.config.url.includes("/auth/token/refresh/")) {
          store.dispatch("logout").then(() => {
            Vue.toasted.global.success({
              message: "Veuillez vous reconnecter.",
            });
          });
          delete axios.defaults.headers.common["Authorization"];
          router.push("/login");

          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        // Try request again with new token
        return jwt
          .refreshToken()
          .then((resp) => {
            // New request with new token
            const config = error.config;
            store.dispatch("refreshAccessToken", resp.data);
            // Adding to axios defaults
            config.headers["Authorization"] = "Bearer " + resp.data.access;

            return new Promise((resolve, reject) => {
              axios
                .request(config)
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          })
          .catch((err) => {
            console.warn(err.response);
          });
      }
    );
  },
};
