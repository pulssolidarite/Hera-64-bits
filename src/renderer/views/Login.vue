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
  mounted: function() {
    this.loading = true;
    this.$store.dispatch("logout");
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/start");
    } else {
      for (let i = 0; i < 5; i++) {
        setTimeout(function(){
          console.log("login attempt");
          this.login();
        }.bind(this), 5000 * i);
      }
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
  },
};
</script>
