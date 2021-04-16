<template>
  <div class="component">
    <div class="view ticket-proposition">
      <div class="content">
        <div class="end-title">
          <span class="h2">Demande de reçu fiscal</span><br />
          <span class="h2"
            >Souhaites tu faire une demande de reçu fiscal ?
          </span>
        </div>
        <div class="end-choice">
          <div
            class="list-button"
            v-for="(choice, i) in choices"
            :key="i"
            :for="i"
            @click.prevent="doChoice(i)"
          >
            <div :class="[selectedChoice == i ? 'selected' : '', 'e-button']">
              {{ choice.name }}
            </div>
          </div>
        </div>
      </div>
      <helpGamepad
        :gpio_help="2"
        @simulate_a="simulate_a"
        @simulate_up="simulate_up"
        @simulate_down="simulate_down"
        :B_but="false"
      />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "ticketProposition",
  components: { helpGamepad },
  props: ["session"],
  data: function() {
    return {
      choices: [
        { name: "Oui je demande un reçu", id: 1 },
        { name: "Non", id: 2 },
      ],
      selectedChoice: "",
    };
  },
  computed: {
    a() {
      return this.$store.state.gamepad.A;
    },
    up() {
      return this.$store.state.gamepad.Up;
    },
    down() {
      return this.$store.state.gamepad.Down;
    },
  },
  watch: {
    a: function(val) {
      if (val) {
        switch (this.selectedChoice) {
          case 0:
            this.$emit("requestTicket");
            break;
          case 1:
            this.$emit("nextView");
            break;
        }
      }
    },
    up: function(val) {
      if (val) {
        this.doChoice(this.selectedChoice - 1);
      }
    },
    down: function(val) {
      if (val) {
        this.doChoice(this.selectedChoice + 1);
      }
    },
  },
  mounted: function() {
    this.doChoice(1);
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
          this.$emit("requestTicket");
          break;
        case 1:
          this.$emit("nextView");
          break;
      }
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

<style scoped>
.content {
  height: 80%;
  width: 100%;
  position: absolute;
  top: 10%;
}

.selected {
  background-color: rgb(252, 236, 17) !important;
}

.end-title {
  text-align: center;
  color: white;
  margin-bottom: 15vh;
}

.list-button {
  margin-top: 2vh;
  color: white;
  font-size: 2rem;
  text-align: center;
}

.e-button {
  width: 30%;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 30px;
  border: 3px solid rgb(255, 56, 56);
  background-color: rgb(255, 129, 129);
}
</style>
