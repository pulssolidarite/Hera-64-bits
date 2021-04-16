import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import jwt from "../axios/jwt";
import router from "../router/index";

import { createPersistedState } from "vuex-electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    errors: "",
    currentUser: JSON.parse(localStorage.getItem("userInfo")) || {},
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    maxGames: 3,
    maxCampaigns: 3,
  },
  mutations: {
    auth_success(state, payload) {
      state.status = "success";
      state.token = payload.token;
      state.user_id = payload.user_id;
      state.is_admin = payload.is_admin;
      state.is_superadmin = payload.is_superadmin;
    },
    auth_error(state, payload) {
      state.status = "error";
      state.errors = payload.response;
    },
    SET_BEARER(state, accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    },
    SET_TOKENS(state, payload) {
      state.accessToken = payload.access;
      state.refreshToken = payload.refresh;
    },
    UPDATE_USER_INFO(state, payload) {
      // Get Data localStorage
      let userInfo =
        JSON.parse(localStorage.getItem("userInfo")) || state.currentUser;
      for (const property of Object.keys(payload)) {
        if (payload[property] != null) {
          // If some of user property is null - user default property defined in state.currentUser
          state.currentUser[property] = payload[property];

          // Update key in localStorage
          userInfo[property] = payload[property];
        }
      }
      // Store data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    DELETE_USER_INFO(state) {
      // Get Data localStorage
      state.currentUser = {};
      state.refreshToken = "";
      state.accessToken = "";
      localStorage.removeItem("userInfo");
    },
    setSessionId(state, id) {
      state.session.id = id;
    },
  },
  actions: {
    startSession({ commit }) {
      // Creating a new donator
      axios.post("donator/", {}).then((resp) => {
        commit("saveCurrentDonator", resp.data);
        // Saving the new session
        axios
          .post("session/", this.state.session)
          .then((resp) => {
            commit("setSessionId", resp.data.id);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    updateSession() {
      axios.put("session/" + this.state.session.id + "/", this.state.session);
    },
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        jwt
          .login(payload.username, payload.password)
          .then((response) => {
            // Set accessToken
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            commit("SET_TOKENS", response.data);

            // Set bearer token in axios
            commit("SET_BEARER", response.data.access);

            // Update user details
            jwt
              .getUserInfo()
              .then((resp) => {
                commit("UPDATE_USER_INFO", resp.data);
                // Navigate User to homepage
                router.push("/start");
                resolve(response);
              })
              .catch((err) => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                reject({
                  message:
                    "Impossible d'accéder à ce compte. Il a peut-être expiré ou a été désactivé.",
                });
              });
          })
          .catch((err) => {
            console.error(err.response);
            reject({
              message:
                "Impossible de se connecter avec ces identifiants. Veuillez réessayer.",
            });
          });
      });
    },
    refreshAccessToken({ commit }, payload) {
      localStorage.setItem("accessToken", payload.access);

      // Set bearer token in axios
      commit("SET_BEARER", payload.access);

      // Update user details
      jwt.getUserInfo().then((resp) => {
        commit("UPDATE_USER_INFO", resp.data);
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        commit("DELETE_USER_INFO");
        resolve({ message: "Vous êtes désormais déconnecté." });
      });
    },
  },
  getters: {
    isLoggedIn: (state) => {
      return state.refreshToken != "";
    },
    isStaff: (state) => {
      if (
        state.refreshToken != "" &&
        state.currentUser.is_staff &&
        !state.currentUser.is_superuser
      ) {
        return true;
      } else {
        return false;
      }
    },
    isAdmin: (state) => {
      return state.refreshToken != "" && state.currentUser.is_superuser;
    },
  },
  plugins: [createPersistedState()], //createSharedMutations()
  strict: process.env.NODE_ENV !== "production",
});
