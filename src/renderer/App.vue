<template>
  <div id="app">
    <!-- <div class="container">
      <div id="notification" class="alert alert-warning mx-auto d-none my-3">
        <div class="d-flex align-items-center justify-content-between">
          <span id="message">Une nouvelle version est disponible !</span>
          <button
            class="btn btn-primary"
            v-if="updateAvailable"
            id="restart-app"
            @click.prevent="restartApp"
            v-gamepad:button-start="restartApp"
          >
            Appuyer sur
            <span class="g-btn"
              ><font-awesome-icon class="small" icon="play"
            /></span>
            pour redémarrer
          </button>
        </div>
      </div>
    </div> -->
    <div class="app-wrapper">
      <router-view />
    </div>
    <!-- <vue-progress-bar /> -->
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");

export default {
  name: "App",
  data: function() {
    return {
      gamepads: [],
      requestID: null,
      updateAvailable: false,
    };
  },
  mounted: function() {
    const version = document.getElementById("version");

    ipcRenderer.send("app_version");
    ipcRenderer.on("app_version", (event, arg) => {
      ipcRenderer.removeAllListeners("app_version");
      //version.innerText = "Version " + arg.version;
    });

    const notification = document.getElementById("notification");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-app");

    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      message.innerText = "A new update is available. Downloading now...";
      this.updateAvailable = true;
    });
    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
      message.innerText =
        "Update Downloaded. It will be installed on restart. Restart now?";
      this.updateAvailable = true;
      notification.classList.remove("d-none");
    });
  },
  methods: {
    restartApp: function() {
      ipcRenderer.send("restart_app");
    },
  },
};
</script>