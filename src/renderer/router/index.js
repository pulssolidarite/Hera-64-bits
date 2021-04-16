import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Test from "../views/Test.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/test",
    name: "test",
    component: Test,
  },
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/start",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.onlyFrom)) {
    if (from.name == to.meta.onlyFrom) {
      next();
      return;
    }
    next("/start");
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next();
      return;
    }
    next("/");
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else if (to.matched.some((record) => record.meta.requiresAnon)) {
    if (!store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router;
