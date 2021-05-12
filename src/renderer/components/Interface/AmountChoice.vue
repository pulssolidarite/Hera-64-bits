<template>
  <div class="component">
    <div class="view amount-choice">
      <div class="container">
        <div class="row">
          <div class="s-title">
            <div class="title">CHOISIS TON MONTANT</div>
            <div class="subtitle">
              <div class="animHorizontalText">Vos dons sont reversés aux associations.</div>
            </div>
          </div>
        </div>
        <!-- <div class="content-amount">
          <img id="mario_bloc" class="amount-frame" src="@/assets/img/amount-frame.svg" alt="cadre" />
          <span class="h2 amount">{{ session.amount }}€</span>
          <span class="h2 amount2">{{ session.amount }}€</span>
        </div>-->

        <div class="row">
          <div class="time">{{ session.terminal.play_timer }} min.</div>
        </div>

        <div class="row">
          <div class="payment-tool"></div>
          <div class="boxes">
            <div class="number-box active">
              <div class="value">0</div>
              <div class="arrow_marker">
                <img id="up-arrow" src="@/assets/img/up-arrow.svg" />
                <img id="down-arrow" src="@/assets/img/down-arrow.svg" />
              </div>
            </div>
            <div class="number-box">
              <div class="value">1</div>
              <div class="arrow_marker"></div>
            </div>
            <div class="euro">
              €
              <div class="arrow_marker"></div>
            </div>
          </div>
        </div>
        <!-- <div class="content-flags">
          <div id="flag1" class="full-flag"></div>
          <div id="flag2" class="full-flag"></div>
          <div id="flag3" class="full-flag"></div>
          <div id="flag4" class="empty-flag"></div>
          <div id="flag5" class="empty-flag"></div>
          <div id="flag6" class="empty-flag"></div>
        </div>

        <div class="slider">
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

          <span id="more-but" class="more-but" @click="simulate_right">
            <img src="@/assets/img/plus_btn.svg" alt="plus" />
          </span>
          <span id="less-but" class="less-but" @click="simulate_left">
            <img src="@/assets/img/moins_btn.svg" alt="moins" />
          </span>

          <div class="content-line" id="content-line"></div>
        </div>-->
        <!-- Campaign DETAILS -->
        <div class="row campaign-row">
          <div class="row amount-detail">
            <div class="amount-media col-md-3">
              <div class="p-3">
                <youtube
                  v-if="session.campaign.is_video == true"
                  v-show="session.campaign.is_video"
                  id="player-ytb"
                  :video-id="session.campaign.video"
                  :player-vars="playerVars"
                  :fitParent="true"
                  ref="youtube"
                  @ready="playerReady()"
                  @playing="playerPlaying()"
                  @ended="playVideo()"
                ></youtube>
                <img v-else :src="session.campaign.logo" :alt="session.campaign.name" />
              </div>
            </div>
            <div class="col-md-9">
              <div class="row p-3 campaign-description">
                <span class="animVerticalText">{{ session.campaign.description }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- \Campaign DETAILS -->

        <div class="row">
          <helpGamepad
            @simulate_a="simulate_a"
            @simulate_b="simulate_b"
            @simulate_left="simulate_left"
            @simulate_right="simulate_right"
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
  data: function() {
    return {
      choosenIndexOf: 2,
      amounts: [1, 5, 10, 20, 30, 50],
      value: 1,
      max: 100,
      duration: 0,
      playerVars: {
        autoplay: 1,
        iv_load_policy: 3,
        playsinline: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        modestbranding: 1
      }
    };
  },
  mounted: function() {
    if (!this.session.position_asso) {
      this.$emit("lastView");
    }
    else {
      if (this.session.position_amount) {
        this.chooseBox(this.session.position_amount - 1);
      } else {
        this.chooseBox(2);
      }
    }
    this.overflowVerify();
    // setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
    playerReady: function() {
      this.$refs.youtube.player.mute();
      this.$refs.youtube.player.getDuration().then(resp => {
        this.duration = resp;
      });
      this.playVideo();
    },
    playerPlaying: async function() {
      let currentTime = this.$refs.youtube.player.getCurrentTime();
      this.timer = (Math.ceil(currentTime) / this.duration) * 100;
    },
    playVideo() {
      this.$refs.youtube.player.playVideo();
    },
    simulate_a() {
      this.proceed();
    },
    simulate_b() {
      this.next();
    },
    simulate_left() {
      if (this.boxes[this.choosenIndexOf - 1]) {
        this.chooseBox(this.choosenIndexOf - 1);
        this.animateIcon("less");
      }
    },
    simulate_right() {
      if (this.boxes[this.choosenIndexOf + 1]) {
        this.chooseBox(this.choosenIndexOf + 1);
        this.animateIcon("more");
      }
    },
    chooseBox: function(index) { // a réécrire ?
      this.choosenIndexOf = index;
      this.$emit("saveAmount", {
        amount: this.amounts[this.choosenIndexOf],
        indexOf: this.choosenIndexOf + 1
      });
      this.flags();
    },
    proceed: function() {
      if (0) {
        // if € box is active
        this.$emit("nextView");
      } else {
        // next box with A and right
        this.$emit("error", {
          visible: true,
          title: "Aucun choix valide",
          errors: {}
        });
      }
    },
    next: function() {
      // on press B or left, if first block is active go to prev. screen
      this.$emit("lastView");
    },
    // animateIcon(dir) {
    //   if (dir == "less") {
    //     var icon = document.getElementById("less-but");
    //   } else {
    //     var icon = document.getElementById("more-but");
    //   }
    //   icon.style.transform = "scale(1.4)";
    //   setTimeout(function() {
    //     icon.style.transform = "scale(1)";
    //   }, 150);
    // },
    overflowVerify: function() {
      var texts = document.getElementsByClassName("slide-description");
      var boxes = document.getElementsByClassName("descr");

      var i = 0;
      while (i < texts.length) {
        console.log(texts[i].offsetHeight + " " + boxes[i].offsetHeight);
        texts[i].classList.add("animVerticalText");
        if (texts[i].offsetHeight > boxes[i].offsetHeight) {
        }
        i++;
      }
    }
  }
};
</script>

<style scoped>
.row {
  justify-content: center;
  margin-top: 3vh;
}

.s-title {
  position: relative;
}

.title,
.subtitle,
.time {
  margin-left: unset;
  margin: unset;
  text-align: center;
  font-family: pixel2;
  color: white;
}

.time {
  text-shadow: 5px 5px #ff9900;
  font-size: 6em;
}

.s-title .title {
  margin-left: 0;
}

.subtitle {
  font-size: 2em;
}

.payment-tool {
  width: 60vw;
  margin-top: 5vh;
  margin-left: auto;
  margin-right: auto;
}

#up-arrow {
  margin-top: -335%;
  animation: topArrow 1s ease-in-out infinite
}

#down-arrow {
  margin-top: -265%;
  animation: botArrow 1s ease-in-out infinite
}

.boxes {
  /* padding-left: calc(50% - 60vw / 2); */
  /* justify-content: center; */
  display: flex;
  justify-content: center;
}

.number-box,
.euro {
  /* display: block; */
  margin: 15px;
  height: 20vh;
  width: 20vh;
  line-height: 20vh; /* text centering vertically */
  text-align: center; /* text centering vertically */
  background-color: #ffff60;
  box-shadow: 3px 8px #ff9900, 0 0 0, 5px 8px #ff9900, 0 0 0;
  font-family: pixel;
  font-size: 10rem;
  color: white;
  text-shadow: 5px 5px #ff9900;
}
.euro {
  font-family: pixel2;
}

.active {
  line-height: calc(20vh + 20px); /* text centering vertically */
  background-color: #ffff08;
  box-shadow: 5px 10px #ffac30, 0 0 0, 7px 10px #ffac30, 0 0 0;
  margin: 5px;
  height: calc(20vh + 20px);
  width: calc(20vh + 20px);
  font-size: 12rem;
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

.campaign-row {
  margin-top:10vh;
}

.campaign-description {
  overflow: hidden;
  height: 155px;
  margin-top: 15px;
}

.amount-media {
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 1500px) {
  /*.amount-choice {*/
  .title {
    max-width: 70vw !important;
    margin-left: 15vw !important;
    font-size: 2.4rem !important;
  }
  .less-but {
    left: -5.5vw !important;
  }
}

.amount-detail {
  margin-left: auto;
  background-color: #512fb5;
  box-shadow: -5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491,
    0px 5px #372491;
  /* border : solid 3px rgb(33, 29, 255); */
  /* border-radius: 15px; */
  /* text-align: left; */
  width: 60vw;
  height: 185px;
  /* z-index: 4; */
  overflow: hidden;
  /* text-overflow: ellipsis; */
  z-index: 5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: pixel2;
  font-size: 2.5rem;
  color: white;
}


.content-line {
  height: 25vh;
  top: 19vw;
}

.content-slidebar {
  box-shadow: -8px 0px #775ce4, 0px -8px #775ce4, 8px 0px #372491,
    0px 8px #372491;
}

.campaign-description {
  font-family: pixel3;
  color: white;
  font-size: 1.2rem;
}

</style>
