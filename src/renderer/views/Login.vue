<template>
  <div>
    <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <h1 class="display-4">
        Connexion en cours
      </h1>
      <p class="lead">
        Connectez votre terminal pour le mettre en service.
      </p>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <vue-element-loading :active="loading" is-full-screen />
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import axios from "axios";

export default {
  name: "Auth",
  components: {
    VueElementLoading,
  },
  data: function() {
    return {
      credentials: {
        username: process.env.PULS_LOGIN,
        password: process.env.PULS_MDP,
      },
      loading: false,
      error: "",
    };
  },
  mounted: async function() {
    this.loading = true;
    this.$store.dispatch("logout");
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/start");
    } else {
      try {
        await this.checkInternetConn();
      } catch(err) {
        throw err;
      }

      // internet connection is ok so proceed to login
      this.login();
    }
  },
  methods: {
    login: function() {
      this.$store
        .dispatch("login", this.credentials)
        .then(() => this.$router.push("/start"))
        .catch((err) => {
          this.loading = false;
          this.error = err.response;
        });
    },

    checkInternetConn: async function() {
      return new Promise(async (resolve, reject) => {
        while (true) {
          try {
            console.log("Checking internet connection");
            await axios.get("https://google.com/");
            break;
          } catch(err) {
            console.error(err);
          }
        }

        console.log("Internet connection ok");
        resolve(true);
      });
    }
  },
};
</script>
