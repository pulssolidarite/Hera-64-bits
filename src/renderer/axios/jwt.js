import axios from "axios";

export default {
  login(username, pwd) {
    return axios.post("/auth/token/", {
      username: username,
      password: pwd,
    });
  },
  getUserInfo() {
    return axios.get("/auth/self/");
  },
  refreshToken() {
    return axios.post("/auth/token/refresh/", {
      refresh: localStorage.getItem("refreshToken"),
    });
  },
};
