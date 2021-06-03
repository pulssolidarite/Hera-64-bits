<template>
  <div class="component">
    <div class="view screensaver">
      <div class="w-title">
        <div class="title">Arcade For Good</div>
        <div class="subtitle">SOUTIENS UNE ASSOCIATION EN JOUANT</div>
      </div>

      <div class="w-content">
        <div class="w-description">1 Jeu, 1 Association, 1 Don</div>
        <div class="cadre">
          <div class="top"></div>
          <div class="bottom"></div>
          <div class="left"></div>
          <div class="right"></div>
          <div class="start-but">
            <div class="button-line">
              <div class="button">A</div> POUR AVANCER
            </div>
            <div class="button-line">
              <div class="button">B</div> POUR REVENIR
            </div>
          </div>
        </div>

        <div class="w-credit">
          <span class="credit-infos">v{{ this.appVersion }}</span>
          <span class="copyright">© PULS IMPACT · 2021</span>
          <span class="credit-infos">Agence en innovations solidaires</span>
        </div>
      </div>

      <!-- GAMEPAD -->
      <helpGamepad :gpio_help="4" @simulate_a="simulate_a" :B_but="false" />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";
import {version} from '../../../../package'

export default {
  name: "Welcome",
  components: { helpGamepad },
  props: [],

  methods: {
    simulate_a() {
      this.start();
    },
    start: function() {
      this.$emit("nextView");
    },
  },
  data: function() {
    return {
      appVersion: version
    };
  }
};
</script>

<style scoped>
.total_donations{
  color:darkorange;
}


.button {
  background-color: rgb(152, 133, 226);
  border-radius: 80px;
  min-width:80px;
  height: 80px;
  font: 50px pixel3;
  line-height: 85px;
  display: inline-block;
  text-align: center;
  padding: 0 0 0 10px;
  vertical-align: middle;
  box-shadow: 5px 5px 0px 2px rgb(73, 55, 143);
  text-shadow: -2px -2px rgb(73, 55, 143);
}

.button-line{
  line-height: 120px;
  height: 120px;
  margin-left: 100px;
  margin-right: 100px;
}
</style>
