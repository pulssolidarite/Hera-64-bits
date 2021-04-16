<template>
  <div class="component">
    <div class="view request-ticket">
      <!-- <div class="header-end">
                <span class="title-end">Demande de reçu fiscal</span> <br>
                <span class="subtitle-end">Pour faire une demande de reçu fiscal, saise ton adresse mail à l'aide du clavier virtuel</span>
            </div> -->
      <div class="s-title">
        <div class="title">Demande de reçu fiscal</div>
        <br />
        <div class="subtitle">
          <div class="animHorizontalText">
            Pour faire une demande de reçu, saisie ton adresse mail à l'aide du
            clavier virtuel.
          </div>
        </div>
      </div>

      <div class="content" style="margin-top: 30vh;">
        <div class="prompt-email">{{ email }}</div>
        <div class="virtual-keyboard">
          <div class="row row-keyboard">
            <div
              v-for="(touch, i) in keys[0]"
              :key="i"
              :for="i"
              @click.prevent="selectTouch(i, 0)"
            >
              <div
                :class="[
                  selectedTouch == touch ? 'selected' : '',
                  'col touch',
                  touch,
                ]"
              >
                {{ touch }}
              </div>
            </div>
          </div>
          <div class="row row-keyboard" style="top:25px;">
            <div
              v-for="(touch, i) in keys[1]"
              :key="i"
              :for="i"
              @click.prevent="selectTouch(i, 1)"
            >
              <div
                :class="[
                  selectedTouch == touch ? 'selected' : '',
                  'col touch',
                  touch,
                ]"
              >
                {{ touch }}
              </div>
            </div>
          </div>
          <div class="row row-keyboard" style="top:50px;">
            <div
              v-for="(touch, i) in keys[2]"
              :key="i"
              :for="i"
              @click.prevent="selectTouch(i, 2)"
            >
              <div
                :class="[
                  selectedTouch == touch ? 'selected' : '',
                  'col touch',
                  touch,
                ]"
              >
                {{ touch }}
              </div>
            </div>
          </div>
          <div class="row row-keyboard" style="top:75px;">
            <div
              v-for="(touch, i) in keys[3]"
              :key="i"
              :for="i"
              @click.prevent="selectTouch(i, 3)"
            >
              <div
                :class="[
                  selectedTouch == touch ? 'selected' : '',
                  'col touch',
                  touch,
                ]"
              >
                {{ touch }}
              </div>
            </div>
          </div>
        </div>
        <div
          :class="[
            selectedTouch == 'valider' ? 'selected' : '',
            'submit-button',
          ]"
          @click="validate()"
        >
          Valider
        </div>
      </div>

      <helpGamepad
        :gpio_help="3"
        @simulate_a="simulate_a"
        @simulate_b="simulate_b"
        @simulate_right="navigOnKeyboard(1)"
        @simulate_left="navigOnKeyboard(2)"
        @simulate_up="navigOnKeyboard(3)"
        @simulate_down="navigOnKeyboard(4)"
      ></helpGamepad>
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "requestTicket",
  props: [],
  components: { helpGamepad },
  data: function() {
    return {
      errors: [],
      keys: [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "@", "<="], // Line 1
        ["null", "a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "null"], // Line 2
        ["null", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "null"], // Line 3
        ["null", "null", ".", "w", "x", "c", "v", "b", "n", "-", "_", "null"], // Line 4
      ],
      email: "",
      selectedTouch: "1",
      index: 0,
      line: 0,
    };
  },
  methods: {
    simulate_a() {
      if (this.selectedTouch == "valider") {
        if (this.checkForm()) {
          console.log("l'email enregistré est : " + this.email);
          this.$emit("nextView");
        } else {
          console.log("erreur : email invalide");
        }
      } else {
        this.email += this.selectedTouch;
      }
    },
    simulate_b() {
      this.$emit("lastView");
    },
    checkForm(e) {
      this.errors = [];

      if (!this.email) {
        this.errors.push("Email required.");
        console.log("Email required.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
        console.log("Valid email required.");
      }

      if (!this.errors.length) {
        return true;
      }
      // e.preventDefault();
    },
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    selectTouch(index, line) {
      this.selectedTouch = this.keys[line][index];
      this.index = index;
      this.line = line;
    },
    validate() {
      this.selectedTouch = "valider";
      console.log("ou ouu");
    },
    horizontalMove(dir) {
      if (this.line == 0) {
        if (dir == 1) {
          // droite
          if (this.index == 11) {
            this.index = 0;
          } else {
            this.index += 1;
          }
        } else {
          // gauche
          if (this.index == 0) {
            this.index = 11;
          } else {
            this.index -= 1;
          }
        }
      } else if (this.line == 1 || this.line == 2) {
        if (dir == 1) {
          // droite
          if (this.index == 10) {
            this.index = 1;
          } else {
            this.index += 1;
          }
        } else {
          // gauche
          if (this.index == 1) {
            this.index = 10;
          } else {
            this.index -= 1;
          }
        }
      } else if (this.line == 3) {
        if (dir == 1) {
          // droite
          if (this.index == 10) {
            this.index = 2;
          } else {
            this.index += 1;
          }
        } else {
          // gauche
          if (this.index == 2) {
            this.index = 10;
          } else {
            this.index -= 1;
          }
        }
      }
    },
    verticalMove(dir) {
      if (this.index == 0) {
        // firt col
        if (dir == 1) {
          //bas
          this.line = 1;
          this.index = 1;
        } else {
          //haut
          this.line = 3;
          this.index = 2;
        }
      } else if (this.index == 11) {
        // last col
        if (dir == 1) {
          //bas
          this.line = 1;
          this.index = 10;
        } else {
          //haut
          this.line = 3;
          this.index = 10;
        }
      } else if (this.index == 1) {
        // second col
        if ((this.line == 0 && dir == -1) || (this.line == 2 && dir == 1)) {
          this.index = 2;
          this.line = 3;
        } else {
          if (dir == 1) {
            this.line += 1;
          } else {
            this.line -= 1;
          }
        }
      } else {
        // other col
        if (dir == 1) {
          if (this.line == 3) {
            this.line = 4;
          } else {
            this.line += 1;
          }
        } else {
          if (this.line == 0) {
            this.line = 3;
          } else {
            this.line -= 1;
          }
        }
      }
    },
    navigOnKeyboard(direction) {
      switch (direction) {
        case 1:
          this.horizontalMove(1); // droite
          break;
        case 2:
          this.horizontalMove(-1); // gauche
          break;
        case 3:
          this.verticalMove(-1); // haut
          break;
        case 4:
          this.verticalMove(1); // bas
          break;
      }
      if (this.line == 4) {
        this.selectedTouch = "valider";
      } else {
        this.selectedTouch = this.keys[this.line][this.index];
      }
    },
  },
};
</script>

<style scoped>
.prompt-email {
  color: black;
  background-color: white;
  font-size: 1.8rem;
  text-align: center;
  border: 3px solid #c97005;
  width: 50vw;
  height: 3rem;
  margin-left: 50%;
  margin-bottom: 10vh;
  transform: translateX(-50%);
}

.touch {
  color: white;
  font-size: 2rem;
  width: 45px;
  height: 55px;
  padding: 0px;
  margin: 3px;
  border: 3px solid #c97005;
  background-color: #7e79fa;
  opacity: 0.8;
  transition: 0.15s ease;
}

.submit-button {
  margin-left: 33vw;
  color: white;
  text-align: center;
  font-size: 2.5rem;
  padding: 10px;
  width: 34vw;
  border: 3px solid #c97005;
  background-color: #7e79fa;
  opacity: 0.8;
  transition: 0.15s ease;
  margin-top: 5vh;
}

.null {
  visibility: hidden;
}

.selected {
  opacity: 1 !important;
  transform: scale(1.1);
}

.virtual-keyboard {
  width: fit-content;
  margin-left: 50%;
  transform: translateX(-50%);
}

.row-keyboard {
  width: fit-content;
  text-align: center;
}

@media screen and (max-width: 1500px) {
  .subtitle {
    font-size: 1.5rem !important;
  }
}
</style>
