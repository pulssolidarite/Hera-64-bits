<template>
  <div class="component">
    <div class="view amount-choice">
      <div class="s-title">
        <div class="title">CHOISIS TON MONTANT</div>
        <div class="subtitle">
          <div class="animHorizontalText">
            Vos dons sont reversés aux assosiations.
          </div>
        </div>
      </div>

      <div class="s-content">
        <div class="content-amount">
          <img
            id="mario_bloc"
            class="amount-frame"
            src="@/assets/img/amount-frame.svg"
            alt="cadre"
          />
          <span class="h2 amount">{{ session.amount }}€</span>
          <span class="h2 amount2">{{ session.amount }}€</span>
          <!-- <span class="h2 amount"><animated-number :value="amounts[choosenIndexOf]" :round="true" :duration="350" :begin="run_anim" :complete="stop_anim"/>€</span>
            <span class="h2 amount2"><animated-number :value="amounts[choosenIndexOf]" :round="true" :duration="350"/>€</span> -->
        </div>

        <div>
          <span class="h2 time">10 min.</span>
        </div>

        <div class="content-flags">
          <div id="flag1" class="full-flag"></div>
          <div id="flag2" class="full-flag"></div>
          <div id="flag3" class="full-flag"></div>
          <div id="flag4" class="empty-flag"></div>
          <div id="flag5" class="empty-flag"></div>
          <div id="flag6" class="empty-flag"></div>
        </div>

        <div class="slider">
          <!-- <div class="container mb-5 pb-3 mt-2 text-center" id="content-slidebar"> -->
          <div class="content-slidebar">
            <div class="progress" style="height: 30px;">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{ width: (this.session.amount / 50) * 100 + '%' }"
                :aria-valuenow="this.session.amount"
                aria-valuemin="0"
                :aria-valuemax="50"
              ></div>
            </div>
          </div>
          <!-- </div> -->

          <span id="more-but" class="more-but" @click="simulate_right"
            ><img src="@/assets/img/plus_btn.svg" alt="plus"
          /></span>
          <span id="less-but" class="less-but" @click="simulate_left"
            ><img src="@/assets/img/moins_btn.svg" alt="moins"
          /></span>

          <div class="content-line" id="content-line">
            <!-- <span class="line1" :style="{ width: (this.session.amount/30)*100 + '%' }"></span> -->
            <!-- <span class="line1" id="line1"></span>
            <span
              class="line2"
            ></span>
            <span class="line3" id="line3"></span> -->
          </div>
        </div>
        <!-- amount DETAILS -->
        <div class="amount-detail">
          <div class="amount-icon">
            <img
              :src="getActionPhoto(session.campaign, session.amount)"
              :alt="session.campaign.name"
              height="125"
              class="rounded"
            />
          </div>
          <span class="amount-description">
            {{ getAction(session.campaign, session.amount) }}
          </span>
        </div>
        <!-- \amount DETAILS -->
      </div>

      <!-- GAMEPAD -->
      <helpGamepad
        @simulate_a="simulate_a"
        @simulate_b="simulate_b"
        @simulate_left="simulate_left"
        @simulate_right="simulate_right"
      />
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
  data: function() {
    return {
      choosenIndexOf: 2,
      amounts: [1, 5, 10, 20, 30, 50],
      value: 1,
      max: 100,
    };
  },
  mounted: function() {
    if (!this.session.position_asso) {
      this.$emit("lastView");
    } else {
      if (this.session.position_amount) {
        this.chooseAmount(this.session.position_amount - 1);
      } else {
        this.chooseAmount(2);
      }
    }
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
    // line_right() {
    //   var line3 = document.getElementById("line3");
    //   if (this.session.amount == 50) {
    //     line3.style.width = "70vw"; //122%
    //   } else {
    //     line3.style.width = "0vw";
    //   }
    // },
    // line_left() {
    //   var line1 = document.getElementById("line1");
    //   switch (this.session.amount) {
    //     case 1:
    //       line1.style.width = "30%";
    //       line1.style.left = "2%";
    //       break;
    //     case 5:
    //       line1.style.width = "20%";
    //       line1.style.left = "9.8%";
    //       break;
    //     case 10:
    //       line1.style.width = "10%";
    //       line1.style.left = "19.8%";
    //       break;
    //     default:
    //       line1.style.left = "40%";
    //       break;
    //   }
    // },
    flags() {
      var flag1 = document.getElementById("flag1");
      var flag2 = document.getElementById("flag2");
      var flag3 = document.getElementById("flag3");
      var flag4 = document.getElementById("flag4");
      var flag5 = document.getElementById("flag5");
      var flag6 = document.getElementById("flag6");
      switch (this.session.amount) {
        case 1:
          flag2.className = "empty-flag";
          break;
        case 5:
          flag2.className = "full-flag";
          flag3.className = "empty-flag";
          break;
        case 10:
          flag3.className = "full-flag";
          flag4.className = "empty-flag";
          break;
        case 20:
          flag4.className = "full-flag";
          flag5.className = "empty-flag";
          break;
        case 30:
          flag5.className = "full-flag";
          flag6.className = "empty-flag";
          break;
        case 50:
          flag6.className = "full-flag";
          break;
      }
    },
    run_anim() {
      var mario = document.getElementById("mario_bloc");
      mario.className = "amount-frame shake-vertical";
    },
    stop_anim() {
      var mario = document.getElementById("mario_bloc");
      mario.className = "amount-frame";
    },
    simulate_a() {
      this.proceed();
    },
    simulate_b() {
      this.$emit("lastView");
    },
    simulate_left() {
      if (this.amounts[this.choosenIndexOf - 1]) {
        this.chooseAmount(this.choosenIndexOf - 1);
        this.animateIcon("less");
      }
    },
    simulate_right() {
      if (this.amounts[this.choosenIndexOf + 1]) {
        this.chooseAmount(this.choosenIndexOf + 1);
        this.animateIcon("more");
      }
    },
    getAction: function(campaign, amount) {
      if (amount == 1) {
        return campaign.text1;
      }
      if (amount == 5) {
        return campaign.text5;
      }
      if (amount == 10) {
        return campaign.text10;
      }
      if (amount == 20) {
        return campaign.text20;
      }
      if (amount == 30) {
        return campaign.text30;
      }
      if (amount == 50) {
        return campaign.text50; //text50 when back ready
      }
    },
    getActionPhoto: function(campaign, amount) {
      if (amount == 1) {
        return campaign.photo1;
      }
      if (amount == 5) {
        return campaign.photo5;
      }
      if (amount == 10) {
        return campaign.photo10;
      }
      if (amount == 20) {
        return campaign.photo20;
      }
      if (amount == 30) {
        return campaign.photo30;
      }
      if (amount == 50) {
        return campaign.photo50; //photo50 when back ready
      }
    },
    chooseAmount: function(index) {
      this.choosenIndexOf = index;
      this.$emit("saveAmount", {
        amount: this.amounts[this.choosenIndexOf],
        indexOf: this.choosenIndexOf + 1,
      });
      // this.line_right();
      // this.line_left();
      this.flags();
    },
    proceed: function() {
      if (this.choosenIndexOf != null) {
        this.$emit("nextView");
      } else {
        this.$emit("error", {
          visible: true,
          title: "Aucun choix valide",
          errors: {},
        });
      }
    },
    animateIcon(dir) {
      if (dir == "less") {
        var icon = document.getElementById("less-but");
      } else {
        var icon = document.getElementById("more-but");
      }
      icon.style.transform = "scale(1.4)";
      setTimeout(function() {
        icon.style.transform = "scale(1)";
      }, 150);
    },
  },
};
</script>

<style scoped>
.content-flags {
  position: relative;
}

.full-flag,
.empty-flag {
  position: absolute;
  width: 80px;
  height: 100px;
  top: 18vh;
  transform: scale(0.8);
}

.full-flag {
  background: no-repeat url("../../assets/img/drap_plein.svg");
  z-index: 5;
}

.empty-flag {
  background: no-repeat url("../../assets/img/drap_vide.svg");
}

#flag1 {
  left: 21.4vw;
}
#flag2 {
  left: 26.1vw;
}
#flag3 {
  left: 31.9vw; /* -0.2 en media < 1500px*/
}
#flag4 {
  left: 43.5vw;
}
#flag5 {
  left: 55.05vw;
}
#flag6 {
  left: 78.26vw;
}

@media screen and (max-width: 1500px) {
  /*.amount-choice {*/
  .title {
    max-width: 70vw !important;
    margin-left: 15vw !important;
    font-size: 2.4rem !important;
  }
  /* } */
  .empty-flag,
  .full-flag {
    margin-left: -4px;
  }
  .less-but {
    left: -5.5vw !important;
  }
}

.content-amount {
  width: 150px;
  margin-left: 50%;
  height: 50px;
  margin-top: 25vh;
}

.amount {
  z-index: 5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 3.1vh;
  font-family: pixel2;
  font-size: 3rem;
  color: white;
}

.amount2 {
  z-index: 2;
  position: absolute;
  left: 50%;
  transform: translateX(-47%);
  margin-top: 3.4vh;
  font-family: pixel2;
  font-size: 3rem;
  color: black;
}

.amount-frame {
  transform: translateX(-50%);
}

.amount-detail {
  margin-left: 50%;
  margin-top: -15vh;
  transform: translateX(-50%);
  background-color: #512fb5;
  box-shadow: -5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491,
    0px 5px #372491;
  /* border : solid 3px rgb(33, 29, 255); */
  /* border-radius: 15px; */
  text-align: center;
  width: 30vw;
  z-index: 4;
}

.time {
  z-index: 5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8vh;
  font-family: pixel2;
  font-size: 2.5rem;
  color: white;
}

.slider {
  position: relative;
  width: 58%;
  margin-left: 21%;
  margin-top: 25vh;
}

.content-line {
  height: 25vh;
  top: 19vw;
}

.content-slidebar {
  box-shadow: -8px 0px #775ce4, 0px -8px #775ce4, 8px 0px #372491,
    0px 8px #372491;
}

.amount-icon .rounded {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.amount-description {
  font-family: pixel3;
  color: white;
  font-size: 1.2rem;
}

.progress {
  border-radius: 0;
}

/* .line1 {
  position: relative;
  top: 78.8%;
  height: 100%;
  display: block;
  box-sizing: border-box;
}

.line2 {
  position: relative;
  top: -25vh;
  display: block;
  box-sizing: border-box;
  width: 10px;
  height: 20vh;
  overflow: hidden;
}

.line3 {
  position: relative;
  top: -101.5%;
  left: 59.5%;
  height: 100%;
  display: block;
  box-sizing: border-box;
}

.line1:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 4px;
  background: #ffc107;
}

.line2:before {
  content: "";
  position: absolute;
  left: -0.3%;
  width: 4px;
  height: 30vh;
  background: #ffc107;
}

.line3:before {
  content: "";
  position: absolute;
  width: 33.33%;
  height: 4px;
  background: #ffc107;
} */

.progress-bar,
.line2,
.line1,
.line3 {
  transition: all 0.35s ease-in-out;
}

.more-but {
  font-size: 3rem;
  color: white;
  width: 30px;
  position: absolute;
  text-align: center;
  top: -9%;
  left: 60vw;
  transition: 0.15s ease;
}

.less-but {
  font-size: 3rem;
  color: white;
  width: 30px;
  position: absolute;
  text-align: center;
  top: -9%;
  left: -4.5vw;
  transition: 0.15s ease;
}

@keyframes shake-vertical {
  2% {
    transform: translate(-50%, -3px) rotate(0);
  }
  4% {
    transform: translate(-50%, -9px) rotate(0);
  }
  6% {
    transform: translate(-50%, 1px) rotate(0);
  }
  8% {
    transform: translate(-50%, -5px) rotate(0);
  }
  10% {
    transform: translate(-50%, 1px) rotate(0);
  }
  12% {
    transform: translate(-50%, -1px) rotate(0);
  }
  14% {
    transform: translate(-50%, -6px) rotate(0);
  }
  16% {
    transform: translate(-50%, 0px) rotate(0);
  }
  18% {
    transform: translate(-50%, 0px) rotate(0);
  }
  20% {
    transform: translate(-50%, 2px) rotate(0);
  }
  22% {
    transform: translate(-50%, 10px) rotate(0);
  }
  24% {
    transform: translate(-50%, 5px) rotate(0);
  }
  26% {
    transform: translate(-50%, 3px) rotate(0);
  }
  28% {
    transform: translate(-50%, 3px) rotate(0);
  }
  30% {
    transform: translate(-50%, 5px) rotate(0);
  }
  32% {
    transform: translate(-50%, 5px) rotate(0);
  }
  34% {
    transform: translate(-50%, -6px) rotate(0);
  }
  36% {
    transform: translate(-50%, 6px) rotate(0);
  }
  38% {
    transform: translate(-50%, -9px) rotate(0);
  }
  40% {
    transform: translate(-50%, 6px) rotate(0);
  }
  42% {
    transform: translate(-50%, 3px) rotate(0);
  }
  44% {
    transform: translate(-50%, 3px) rotate(0);
  }
  46% {
    transform: translate(-50%, 6px) rotate(0);
  }
  48% {
    transform: translate(-50%, -9px) rotate(0);
  }
  50% {
    transform: translate(-50%, 7px) rotate(0);
  }
  52% {
    transform: translate(-50%, 9px) rotate(0);
  }
  54% {
    transform: translate(-50%, 3px) rotate(0);
  }
  56% {
    transform: translate(-50%, -1px) rotate(0);
  }
  58% {
    transform: translate(-50%, -2px) rotate(0);
  }
  60% {
    transform: translate(-50%, -6px) rotate(0);
  }
  62% {
    transform: translate(-50%, -5px) rotate(0);
  }
  64% {
    transform: translate(-50%, 4px) rotate(0);
  }
  66% {
    transform: translate(-50%, -4px) rotate(0);
  }
  68% {
    transform: translate(-50%, -2px) rotate(0);
  }
  70% {
    transform: translate(-50%, -8px) rotate(0);
  }
  72% {
    transform: translate(-50%, -6px) rotate(0);
  }
  74% {
    transform: translate(-50%, -4px) rotate(0);
  }
  76% {
    transform: translate(-50%, 0px) rotate(0);
  }
  78% {
    transform: translate(-50%, 7px) rotate(0);
  }
  80% {
    transform: translate(-50%, -6px) rotate(0);
  }
  82% {
    transform: translate(-50%, 10px) rotate(0);
  }
  84% {
    transform: translate(-50%, -4px) rotate(0);
  }
  86% {
    transform: translate(-50%, 10px) rotate(0);
  }
  88% {
    transform: translate(-50%, -1px) rotate(0);
  }
  90% {
    transform: translate(-50%, 1px) rotate(0);
  }
  92% {
    transform: translate(-50%, 9px) rotate(0);
  }
  94% {
    transform: translate(-50%, -4px) rotate(0);
  }
  96% {
    transform: translate(-50%, -8px) rotate(0);
  }
  98% {
    transform: translate(-50%, 4px) rotate(0);
  }
  0%,
  100% {
    transform: translate(-50%, 0) rotate(0);
  }
}

.shake-vertical {
  animation-name: shake-vertical;
  animation-duration: 100ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
</style>
