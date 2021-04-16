<template>
  <div class="component">
    <div class="view end">
      <div class="s-title">
        <div class="title">Fin de partie !</div>
        <br />
        <div class="subtitle">Merci d'avoir joué, on réessaye ?</div>
      </div>

      <div class="end-content">
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

      <helpGamepad
        :gpio_help="2"
        @simulate_a="simulate_a"
        @simulate_up="simulate_up"
        @simulate_down="simulate_down"
      />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "End",
  components: { helpGamepad },
  props: ["session"],
  data: function() {
    return {
      choices: [
        { name: "Rejouer", id: 1 },
        { name: "Revenir à l'accueil", id: 2 },
        //{ name: "Demande de reçu fiscal", id: 3 },
        { name: "Qui sommes-nous ?", id: 3 },
      ],
      selectedChoice: "",
    };
  },
  mounted: function() {
    this.$emit("endGameSession");
    this.$emit("endSession");
    setTimeout(() => this.$emit("home"), 1000 * 60);
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
          this.$emit("replay");
          break;
        case 1:
          this.$emit("home");
          break;
        // case 2:
        //   this.$emit("ticket_request");
        //   break;
        case 2:
          this.$emit("moreInfo");
          break;
        default:
          this.$emit("error", {
            visible: true,
            title: "Aucun choix valide",
            errors: {},
          });
          break;
      }
    },
    simulate_b() {
      this.$emit("lastView");
    },
    doChoice(index) {
      if (index > 3) {
        this.selectedChoice = 0;
      } else if (index < 0) {
        this.selectedChoice = 3;
      } else {
        this.selectedChoice = index;
      }
    },
  },
};
</script>
