<template>
  <div class="component">
    <vue-element-loading :active="loading" is-full-screen />
    <div
      class="h-100 w-100 d-flex align-items-center justify-content-center bg-gradient text-white"
    >
      <div class="row d-flex flex-column">
        <h1 class="display-4 text-center text-white">
          Le jeu a débuté
        </h1>
        <p class="lead text-white">
          Chargement.
        </p>
        <p><strong>Status</strong> : {{ this.status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import path from "path";

export default {
  name: "Play",
  props: ["session"],
  data: function() {
    return {
      currentGame: this.$store.state.currentGame,
      loading: false,
      status: "",
    };
  },
  components: {
    VueElementLoading,
  },
  mounted: function() {
    // This View is used to launch the game
    this.loading = true;

    // We first launch the timer for the game session and we also stop listening to the Gamepad for now
    // to prevent missclick...
    this.$emit("startGameSession");

    // We then prepare the command and we launch it in a separate Node.js shell
    const pathToCore = process.env.HOME + "/games/cores/" + this.session.game.core.path;
    const pathToGame = process.env.HOME + "/games/roms/" + this.session.game.path;

    let command = 'retroarch -v -f -L "' + pathToCore + '" "' + pathToGame + '"';
    console.log(command);
    this.startShell(command);
  },
  methods: {
    startShell: function(command) {
      // We launch a child process containing a Retroarch session
      var exec = require("child_process").exec;
      var shell = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          this.status = error;
          this.loading = false;
          this.endGame();
        } else {
          this.status = stdout;

          this.endGame();
        }
      });
      // We use a global timer to kill the game after 10 minutes
      // TO-DO : maybe add a message that the time is out
      if (this.session.terminal.play_timer) {
        var timer = setTimeout(function() {
          exec('killall "retroarch"');
        }, 1000 * 60 * this.session.terminal.play_timer); // milisecond*second*minute
      } else {
        var timer = setTimeout(function() {
          exec('killall "retroarch"');
        }, 1000 * 60 * 10); // milisecond*second*minute
      }
    },
    endGame: function() {
      this.loading = false;
      this.$emit("nextView");
    },
  },
};
</script>
