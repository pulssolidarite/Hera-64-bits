<template>
  <div class="footer">
    <div class="gamapad1" id="gp1" style="height:100%;">
      <div class="left-side">
        <div class="gpio1" id="gpio1" style="display: none;">
          <span
            class="left-gpio"
            v-gamepad:button-dpad-right="simulate_left"
            v-gamepad:left-analog-right="simulate_left"
            v-gamepad:right-analog-right="simulate_left"
            @click="simulate_left"
            ><img
              class="arrow-left-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span class="dot"
            ><img src="@/assets/img/Joystick_footer.svg" alt="joystick"
          /></span>
          <span
            class="right-gpio"
            v-gamepad:button-dpad-left="simulate_right"
            v-gamepad:left-analog-left="simulate_right"
            v-gamepad:right-analog-left="simulate_right"
            @click="simulate_right"
            ><img
              class="arrow-right-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span class="gpio-help"> Se déplacer </span>
        </div>

        <div class="gpio2" id="gpio2" style="display: none;">
          <span
            class="up-gpio"
            v-gamepad:button-dpad-up="simulate_up"
            v-gamepad:right-analog-up="simulate_up"
            v-gamepad:left-analog-up="simulate_up"
            @click="simulate_up"
            ><img
              class="arrow-up-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span
            class="dot"
            v-gamepad:button-dpad-down="simulate_down"
            v-gamepad:left-analog-down="simulate_down"
            v-gamepad:right-analog-down="simulate_down"
            @click="simulate_down"
            ><img src="@/assets/img/Joystick_footer.svg" alt="joystick"
          /></span>
          <!-- <span class="down-gpio"  @click="simulate_down"><img class="arrow-down-ft" src='@/assets/img/arrow_footer.svg' alt='arrow footer'></span> -->
          <span class="gpio-help"> Se déplacer </span>
        </div>
        <div class="gpio3" id="gpio3" style="display: none;">
          <span
            class="left-gpio"
            v-gamepad:button-dpad-right="simulate_left"
            v-gamepad:left-analog-right="simulate_left"
            v-gamepad:right-analog-right="simulate_left"
            @click="simulate_left"
            ><img
              class="arrow-left-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span
            class="up-gpio"
            v-gamepad:button-dpad-up="simulate_up"
            v-gamepad:right-analog-up="simulate_up"
            v-gamepad:left-analog-up="simulate_up"
            @click="simulate_up"
            ><img
              class="arrow-up-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span
            class="dot"
            v-gamepad:button-dpad-down="simulate_down"
            v-gamepad:left-analog-down="simulate_down"
            v-gamepad:right-analog-down="simulate_down"
            @click="simulate_down"
            ><img src="@/assets/img/Joystick_footer.svg" alt="joystick"
          /></span>
          <!-- <span class="down-gpio"  @click="simulate_down"><img class="arrow-down-ft" src='@/assets/img/arrow_footer.svg' alt='arrow footer'></span> -->
          <span
            class="right-gpio"
            v-gamepad:button-dpad-left="simulate_right"
            v-gamepad:left-analog-left="simulate_right"
            v-gamepad:right-analog-left="simulate_right"
            @click="simulate_right"
            ><img
              class="arrow-right-ft"
              src="@/assets/img/arrow_footer.svg"
              alt="arrow footer"
          /></span>
          <span class="gpio-help"> Se déplacer </span>
        </div>
        <div class="no-gpio" id="no-gpio" style="display: none;">
          <span class="dot"
            ><img src="@/assets/img/Joystick_footer.svg" alt="joystick"
          /></span>
          <span class="gpio-help"> Se déplacer </span>
        </div>
      </div>
      <div class="right-side">
        <div
          class="B-but"
          id="B-but"
          v-gamepad:button-x="simulate_b"
          @click="simulate_b"
        >
          <img src="@/assets/img/btn_footer.svg" alt="btn" />
          <div class="g-btn">B</div>
          <span class="txt-btn">Retour</span>
        </div>
        <div
          class="A-but"
          id="A-but"
          v-gamepad:button-b="simulate_a"
          @click="simulate_a"
        >
          <img src="@/assets/img/btn_footer.svg" alt="btn" />
          <span class="g-btn">A</span>
          <span class="txt-btn">Valider</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "helpGamepad",
  props: {
    gpio_help: { type: Number, default: 1 },
    A_but: { type: Boolean, default: true },
    B_but: { type: Boolean, default: true },
  },
  mounted() {
    this.select_ath(this.gpio_help, this.A_but, this.B_but);
  },
  methods: {
    simulate_a() {
      this.$emit("simulate_a");
    },
    simulate_b() {
      this.$emit("simulate_b");
    },
    simulate_left() {
      this.$emit("simulate_left");
    },
    simulate_right() {
      this.$emit("simulate_right");
    },
    simulate_up() {
      this.$emit("simulate_up");
    },
    simulate_down() {
      this.$emit("simulate_down");
    },
    select_ath(gpio_help, A_but, B_but) {
      let gpio1 = document.getElementById("gpio1"); // 1 : gpio left-right
      let gpio2 = document.getElementById("gpio2"); // 2 : gpio up-down
      let gpio3 = document.getElementById("gpio3"); // 3 : gpio all-direction
      let no_gpio = document.getElementById("no-gpio"); // 4 : no-gpio
      switch (gpio_help) {
        case 1:
          gpio1.style.display = "block";
          break;
        case 2:
          gpio2.style.display = "block";
          break;
        case 3:
          gpio3.style.display = "block";
          break;
        case 4:
          no_gpio.style.display = "none";
          break;
        default:
          this.$emit("error", {
            visible: true,
            title: "Aucun helpGamepad valide",
            errors: {},
          });
          break;
      }
      if (!A_but) {
        let Element_A = document.getElementById("A-but");
        Element_A.style.display = "none";
      }
      if (!B_but) {
        let Element_B = document.getElementById("B-but");
        Element_B.style.display = "none";
      }
    },
  },
};
</script>

<style scoped></style>
