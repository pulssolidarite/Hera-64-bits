<template>
  <div id="errorModal" v-if="visible">
    <div class="bg-error"></div>
    <div class="view Errors">
      <div class="error-modal">
        <div class="bg-modal"></div>
        <div class="error-titles">
          <div class="title">{{ title }}</div>
          <div class="subtitle">{{ errors[0] }}</div>
        </div>
        <div class="error-line"></div>
        <div class="error-menu">
          <div class="but-group">
            <div
              class="but-list"
              v-for="(choice, i) in choices"
              :key="i"
              :for="i"
              @click.prevent="doChoice(i)"
            >
              <div :class="[selectedChoice == i ? 'selected' : '', 'e-button']">
                <div class="text-button">{{ choice.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <helpGamepad
        :gpio_help="2"
        v-gamepad:button-a="simulate_a"
        v-gamepad:button-b="simulate_b"
        v-gamepad:button-dpad-up="simulate_up"
        v-gamepad:button-dpad-down="simulate_down"
        v-gamepad:left-analog-down="simulate_down"
        v-gamepad:left-analog-up="simulate_up"
        v-gamepad:right-analog-down="simulate_down"
        v-gamepad:right-analog-up="simulate_up"
        @simulate_a="simulate_a"
        @simulate_b="simulate_b"
        @simulate_up="simulate_up"
        @simulate_down="simulate_down"
      />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "Error",
  components: { helpGamepad },
  props: ["visible", "title", "errors"],
  data: function() {
    return {
      choices: [
        { name: "Réessayer", id: 1 },
        { name: "Revenir à l'accueil", id: 2 },
      ],
      selectedChoice: "",
    };
  },
  mounted: function() {
    this.doChoice(0);
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
    simulate_up() {
      this.doChoice(this.selectedChoice - 1);
    },
    simulate_down() {
      this.doChoice(this.selectedChoice + 1);
    },
    simulate_a() {
      switch (this.selectedChoice) {
        case 0:
          this.$emit("lastView");
          break;
        case 1:
          this.$emit("homeView");
          break;
      }
    },
    simulate_b() {
      this.$emit("lastView");
    },
    doChoice(index) {
      if (index > 1) {
        this.selectedChoice = 0;
      } else if (index < 0) {
        this.selectedChoice = 1;
      } else {
        this.selectedChoice = index;
      }
    },
  },
};
</script>
