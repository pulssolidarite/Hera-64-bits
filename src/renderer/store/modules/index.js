import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import { createPersistedState, createSharedMutations } from "vuex-electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    errors: "",
    token: localStorage.getItem("token") || "",
    user_id: localStorage.getItem("user_id") || "",
    is_admin: localStorage.getItem("is_admin") == "true" || "",
    is_superadmin: localStorage.getItem("is_superadmin") == "true" || "",
    maxGames: 3,
    maxCampaigns: 3,
    currentDonator: "",
    newDonatorEmail: "",
    currentTerminal: "",
    currentCampaign: "",
    currentGame: "",
    session: {
      terminal: "",
      donator: "",
      start_global: null,
      end_global: null,
      start_time: null,
      end_time: null,
      position_asso: "",
      campaign: "",
      game: null,
    },
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
    logout(state) {
      state.status = "";
      state.token = "";
      state.user_id = "";
      state.is_admin = false;
      state.is_superadmin = false;
    },
    saveCurrentDonator(state, donator) {
      state.currentDonator = donator;
      state.session.donator = donator.id;
    },
    saveCurrentTerminal(state, terminal) {
      state.currentTerminal = terminal;
    },
    startTerminal(state, payload) {
      state.currentTerminal = payload.terminal;
    },
    stopTerminal(state) {
      state.currentTerminal = "";
      state.currentCampaign = "";
    },
    saveNewDonatorEmail(state, email) {
      state.newDonatorEmail = email;
    },
    deleteGamingStates(state) {
      state.newDonatorEmail = "";
      state.currentDonator = "";
      state.currentPayment = {};
      state.currentTerminal = "";
      state.currentCampaign = "";
      state.currentGame = "";
      state.session = {};
    },
    startSession(state) {
      state.session.start_global = new Date();
    },
    endSession(state) {
      state.session.end_global = new Date();
    },
    startGameSession(state) {
      state.session.start_time = new Date();
    },
    endGameSession(state) {
      state.session.end_time = new Date();
    },
    saveCampaignChoice(state, payload) {
      state.session.campaign = payload.campaign.id;
      state.currentCampaign = payload.campaign;
      state.session.terminal = state.currentTerminal.id;
      state.session.position_asso = payload.indexOf;
    },
    saveGameChoice(state, payload) {
      state.currentGame = payload;
      state.session.game = payload.id;
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
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios
          .post("auth/", user)
          .then((resp) => {
            const token = "Token " + resp.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", resp.data.user_id);
            localStorage.setItem("is_admin", resp.data.is_admin);
            localStorage.setItem("is_superadmin", resp.data.is_superadmin);
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", {
              token: token,
              user_id: resp.data.user_id,
              is_admin: resp.data.is_admin,
              is_superadmin: resp.data.is_superadmin,
            });
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    register({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post("api/user/", credentials)
          .then((response) => {
            // Connexion et ajout du token
            console.log(response);
            resolve(response);
          })
          .catch((err) => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        if (!this.getters.isAdmin) {
          axios
            .get("terminal/mine/off/")
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => {
              console.log(err.response);
            });
        }
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("is_admin");
        localStorage.removeItem("is_superadmin");
        delete axios.defaults.headers.common["Authorization"];
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isAdmin: (state) => state.is_admin,
    isSuperAdmin: (state) => state.is_superadmin,
  },
  modules: {},
  plugins: [createPersistedState(), createSharedMutations()],
});
