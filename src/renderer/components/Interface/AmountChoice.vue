<template>
  <div class="component">
    <div class="view amount-choice">
      <div class="container">
        <!-- title -->
        <div class="row">
          <div class="s-title">
            <div class="title">CHOISIS TON MONTANT</div>
            <div class="subtitle">
              <div>Ton don sera reversé à {{ session.campaign.name }}.</div>
            </div>
              <div id="freeModeMessage" v-if="session.terminal.is_free">
				Si tu sélectionnes 0€, c'est ton entreprise qui s'engage à faire un don à ta place <span class="material-icon pink">favorite</span>
			  </div>
          </div>
        </div>
        <!-- time -->

        <!-- payment-tool -->
        <div id="payment-tool" class="row">
          <div id="arrows">
            <img id="up-arrow" class="arrow" src="@/assets/img/up-arrow.svg" />
            <div class="invisible-box"></div>
            <img id="down-arrow" class="arrow" src="@/assets/img/down-arrow.svg" />
          </div>
          <div class="boxes">
            <div class="number-box active">{{ amount[0].n }}</div>
            <div class="number-box">{{ amount[1].n }}</div>
            <div class="euro number-box">
              <div id="maxlimit" v-if="eurobox == 'maxlimit'">
                Max.
                <br />
                {{ max_amount }}€
              </div>
              <div id="minlimit" v-if="eurobox == 'minlimit'">
                Min.
                <br />
                {{ min_amount }}€
              </div>
              <div id="default" v-if="eurobox == 'default'">€</div>
              <div id="start" v-if="eurobox == 'start'">Start</div>
            </div>
          </div>
        </div>
        <!-- campaing -->
        <div class="row campaign-row">
          <div
            v-for="(step, i) in session.campaign.donationSteps"
            :key="i"
            :index="i"
            class="donationsteps"
            ref="steptext"
          >
            <div class="donationstep">
              <img
                class="donationStepImage"
                :src="step.image"
                :alt="session.campaign.name"
              />
              {{ step.text }}
            </div>
          </div>
        </div>
        <!-- footer -->
        <div class="row">
          <helpGamepad
            :gpio_help="3"
            @simulate_a="simulate_a"
            @simulate_b="simulate_b"
            @simulate_left="simulate_left"
            @simulate_right="simulate_right"
            @simulate_up="simulate_up"
            @simulate_down="simulate_down"
          />
        </div>
      </div>

      <!-- GAMEPAD -->
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";
import AnimatedNumber from "animated-number-vue";

export default {
  name: "AmountChoice",
  components: { helpGamepad, AnimatedNumber },
  props: ["session"],
  data: function () {
    return {
      active_box: 0,
      boxes: "",
      arrows: "",
      amount: [
        { n: 0, limit: 5 },
        { n: 1, limit: 9 },
      ],
      max_amount: 50,
      min_amount: 1,
      eurobox: "default",
    };
  },
  mounted: function () {
    if (!this.session.position_asso) {
      this.$emit("lastView");
    }

    this.updateDonationStep();
	this.defineFreeMode();

    this.boxes = document.getElementsByClassName("number-box");
    this.arrows = document.getElementById("arrows");

    this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
	  defineFreeMode: function () {
		  if (this.session.terminal.is_free){
			  this.min_amount = 0;
			  this.amount[1].n = 0;
		  }
	  },
    updateDonationStep: function () {
      if (!this.session.campaign.donationSteps) return;
      this.session.campaign.donationSteps.forEach((step, i, steps) => {
        if (
          this.countAmount() >= step.amount &&
          this.countAmount() < (steps[i + 1] == null ? 55 : steps[i + 1].amount)
        ) {
          // this.$refs.carousel.slideTo(i);
          this.$refs.steptext[i].style.boxShadow =
            "-5px 0px yellow, 0px -5px yellow, 5px 0px #ff9900, 0px 5px #ff9900";
          // return;
        } else {
          this.$refs.steptext[i].style.boxShadow =
            "-5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491, 0px 5px #372491";
        }
      });
    },
    countAmount() {
      // return in cents : 1€ = 100
      var count = 0;
      var e = 1;
      this.amount.forEach((a) => {
        count += a.n * 10 ** e;
        e--;
      });

      return count;
    },
    updateEurobox() {
      var count = this.countAmount();

      this.eurobox = "default";
      document.getElementsByClassName("euro")[0].style.background = "#ffff60";

      if (count < this.min_amount) {
        this.eurobox = "minlimit";
        document.getElementsByClassName("euro")[0].style.background = "red";
      } else if (count > this.max_amount) {
        this.eurobox = "maxlimit";
        document.getElementsByClassName("euro")[0].style.background = "red";
      }
    },
    nextBox(direction = 1) {
      // direction = 1 or -1

      if (
        (direction != 1 && direction != -1) ||
        (this.active_box <= 0 && direction == -1) ||
        (this.active_box >= this.boxes.length - 1 && direction == 1)
      )
        return;

      this.active_box += direction;
      this.boxes[this.active_box].classList.toggle("active");
      this.boxes[this.active_box - direction].classList.toggle("active");
      this.moveArrows(direction);
    },
    moveArrows(direction = 1) {
      if (this.active_box < this.boxes.length - 1) {
        this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
      }
      if (this.eurobox == "default" && this.active_box == this.boxes.length - 1) {
        this.eurobox = "start";
        this.arrows.style.display = "none";
        this.boxes[this.boxes.length - 1].classList.toggle("start");
        this.boxes[this.boxes.length - 1].classList.toggle("default");
        document.getElementsByClassName("euro")[0].style.background = "#99c961";
      } else if (this.eurobox == "start" && this.active_box < this.boxes.length) {
        this.eurobox = "default";
        this.arrows.style.display = "block";
        this.boxes[this.boxes.length - 1].classList.toggle("start");
        this.boxes[this.boxes.length - 1].classList.toggle("default");
        document.getElementsByClassName("euro")[0].style.background = "#ffff60";
      }
    },
    incrementNum(incr = 1) {
      // incr is direction 1 or -1
      if ((incr != 1 && incr != -1) || this.active_box >= this.boxes.length - 1) return;
      if (this.amount[this.active_box].n == 0 && incr == -1)
        this.amount[this.active_box].n = this.amount[this.active_box].limit;
      else
        this.amount[this.active_box].n =
          (this.amount[this.active_box].n + incr) %
          (this.amount[this.active_box].limit + 1);

      this.updateDonationStep();
      this.updateEurobox();
    },
    simulate_a() {
      if (this.active_box < this.boxes.length - 1) {
        this.nextBox(1);
      } else if (this.active_box == this.boxes.length - 1 && this.eurobox == "start") {
        this.$emit("saveAmount", {
          amount: this.countAmount(),
        });
        this.$emit("nextView");
      }
    },
    simulate_b() {
      if (this.active_box == 0) {
        this.$emit("lastView");
      } else if (this.active_box < this.boxes.length) {
        this.nextBox(-1);
      }
    },
    simulate_left() {
      this.nextBox(-1);
    },
    simulate_right() {
      this.nextBox(1);
    },
    simulate_up: function () {
      this.incrementNum(1);
    },
    simulate_down: function () {
      this.incrementNum(-1);
    },
  },
};
</script>

<style scoped>
.campaign-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  min-width: 100%;
}

#start {
  font-size: 5vh;
}
#maxlimit,
#minlimit {
  font-size: 5vh;
  line-height: calc(15vh / 2);
}
#payment-tool {
  justify-content: center;
}

#payment-tool {
  margin-top: 12vh;
  margin-bottom: 10vh;
}
#arrows {
  line-height: 15vh;
  position: absolute;
  transition-duration: 0.3s;
}

.s-title {
  position: relative;
}

.s-title .subtitle {
  font-family: Pixel2;
  font-size: 3.5vh;
  max-width: 70vw;
  color: #c97005;
  overflow: hidden;
}

.subtitle {
  font-size: 2em;
}

.title,
.subtitle {
  margin-left: unset;
  margin: unset;
  text-align: center;
  font-family: pixel2;
  color: white;
}

.payment-tool {
  width: 60vw;
  margin-left: auto;
  margin-right: auto;
}

#arrows {
  margin-top: -48px;
}

#up-arrow {
  animation: topArrow 1s ease-in-out infinite;
}

#down-arrow {
  margin-top: 15px;
  animation: botArrow 1s ease-in-out infinite;
}

.arrow {
  display: block;
  margin-left: calc((15vh / 2) - 20px);
}
.boxes {
  display: flex;
  justify-content: center;
}

.number-box,
.euro,
.invisible-box {
  transition-duration: 0.1s;
  margin: 15px;
  height: 15vh;
  width: 15vh;
  line-height: 15vh; /* text centering vertically */
  text-align: center; /* text centering vertically */
}

.number-box:not(.euro) {
  padding-left: 15px;
}

.invisible-box {
  margin: 5px;
  height: calc(15vh + 20px);
  width: calc(15vh + 20px);
  justify-content: center;
}

.number-box,
.euro {
  background-color: #ffff60;
  box-shadow: 3px 8px #ff9900, 0 0 0, 5px 8px #ff9900, 0 0 0;
  font-family: pixel;
  font-size: 9rem;
  color: white;
  text-shadow: 5px 5px #ff9900;
}

.euro {
  font-family: pixel2;
  font-weight: bold;
}

.active {
  line-height: calc(15vh + 20px); /* text centering vertically */
  background-color: #ffff08;
  box-shadow: 5px 10px #ffac30, 0 0 0, 7px 10px #ffac30, 0 0 0;
  margin: 5px;
  height: calc(15vh + 20px);
  width: calc(15vh + 20px);
  font-size: 11rem;
}

@keyframes overflowVerticalText {
  20% {
    transform: translateY(0%);
  }
  98% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}
.animVerticalText {
  animation: overflowVerticalText 10s linear infinite;
}

@keyframes topArrow {
  50% {
    transform: translateY(-10px);
  }
}
@keyframes botArrow {
  50% {
    transform: translateY(10px);
  }
}

.donationStepImage {
  height: 120px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
}

.donationsteps {
  margin-left: 30px;
  background-color: #512fb5;
  box-shadow: -5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491, 0px 5px #372491;
  width: 280px;
  height: 400px;
  font-family: pixel2;
  font-size: 1.1rem;
  color: white;
  padding: 15px;
  transition-duration: 0.3s;
}

#freeModeMessage{
  font-family: Pixel2;
  font-size: 1.8vh;
  color: white;
  height: 50px;
  position: absolute;
  margin: auto;
  left: 50%;
  transform: translate(-50%, 0px);
  width: 100%
}

.pink{
	color: rgb(255, 0, 0);
}
</style>
