import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "vueperslides/dist/vueperslides.css";
import "./assets/css/theme.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faPen,
  faTimes,
  faPlus,
  faCheck,
  faLink,
  faEuroSign,
  faPlay,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueProgressBar from "vue-progressbar";
import VueYoutube from "vue-youtube";
import interceptors from "./axios/index.js";
import VueGamepad from "vue-gamepad";

Vue.use(VueGamepad);

Vue.use(VueYoutube);

// Loading bar stuff
Vue.use(VueProgressBar, {
  color: "rgb(91, 184, 93)",
  failedColor: "red",
  height: "3px",
});

// Font Awesome Stuff
library.add(
  faUserSecret,
  faPen,
  faTimes,
  faPlus,
  faCheck,
  faLink,
  faEuroSign,
  faPlay,
  faVideo
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

// Axios stuff
Vue.prototype.$http = axios;
//Vue.prototype.$http.defaults.baseURL = process.env.SERVER_URL;


// Comment one of these lines depending on needs
Vue.prototype.$http.defaults.baseURL = "https://puls-back-preprod.herokuapp.com/";
// Vue.prototype.$http.defaults.baseURL = "https://puls-back-prod.herokuapp.com/";
const token = localStorage.getItem("accessToken");

if (token) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
}
// We create the interceptors for AXIOS 401 responses
interceptors.createAxiosResponseInterceptor();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");


window.onload = function(){
	document.body.style.cursor = "none";
}
