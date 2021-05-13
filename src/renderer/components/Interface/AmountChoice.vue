<template>
  <div class="component">
    <div class="view amount-choice">
      <div class="container">
        <!-- title -->
        <div class="row">
          <div class="s-title">
            <div class="title">CHOISIS TON MONTANT</div>
            <div class="subtitle">
              <div class="animHorizontalText">Vos dons sont reversés aux associations.</div>
            </div>
          </div>
        </div>
        <!-- time -->
        <div id="time" class="row">
          <div class="time">{{ session.terminal.play_timer }} min.</div>
        </div>
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
            <div class="comma">,</div>
            <div class="number-box">{{ amount[2].n }}</div>
            <div class="number-box">{{ amount[3].n }}</div>
            <div class="euro number-box">€</div>
          </div>
        </div>
        <!-- campaing -->
        <div class="row campaign-row">
          <div class="row amount-detail">
            <div class="amount-media col-md-4">
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
            <div class="col-md-8">
              <div class="row p-3 campaign-description">
                <span class="animVerticalText">{{ session.campaign.description }}</span>
              </div>
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
  data: function() {
    return {
      active_box: 0,
      boxes: "",
      arrows: "",
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
      },
      amount: [{ n: 0 }, { n: 1 }, { n: 0 }, { n: 0 }]
    };
  },
  mounted: function() {
    if (!this.session.position_asso) {
      this.$emit("lastView");
    }

    this.boxes = document.getElementsByClassName("number-box");
    this.arrows = document.getElementById("arrows");
    // var reversed = boxes.reverse();

    this.overflowVerify();
    this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
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
    nextBox(direction = 1) {
      // direction = 1 or -1

      if (
        (direction != 1 && direction != -1) ||
        (this.active_box <= 0 && direction == -1) ||
        (this.active_box >= this.boxes.length - 1 && direction == 1)
      )
        return;

      console.log(this.active_box);
      // console.log("this.boxes[this.active_box"+direction+"].offsetLeft = "+this.boxes[this.active_box + direction].offsetLeft);

      this.boxes[this.active_box].classList.toggle("active");
      this.boxes[this.active_box + direction].classList.toggle("active");

      if (
        (direction == 1 && this.active_box <= 2) ||
        (direction == -1 && this.active_box <= 3)
      ) {
        this.arrows.style.left =
          this.boxes[this.active_box + direction].offsetLeft + "px";
      }

      this.active_box += direction;
    },
    incrementNum(incr = 1) {
      // incr is direction 1 or -1
      if (incr != 1 && incr != -1) return;
      console.log(this.active_box);

      if (this.amount[this.active_box].n == 0 && incr == -1)
        this.amount[this.active_box].n = 9;
      else
        this.amount[this.active_box].n =
          (this.amount[this.active_box].n + incr) % 10;
    },
    simulate_a() {
      this.proceed();
      // console.log("a");
    },
    simulate_b() {
      this.next();
      // console.log("b");
    },
    simulate_left() {
      this.nextBox(-1);
    },
    simulate_right() {
      this.nextBox(1);
    },
    simulate_up: function() {
      this.incrementNum(1);
    },
    simulate_down: function() {
      this.incrementNum(-1);
    },
    proceed: function() {
      console.log("proceed");

      this.$emit("nextView");
    },
    previous: function() {
      // on press B or left, if first block is active go to prev. screen
      this.$emit("lastView");
    },
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
#payment-tool {
  margin-top: 10vh;
  margin-bottom: 5vh;
}
#arrows {
  line-height: 15vh;
  position: absolute;
}

#time {
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
  margin-left: auto;
  margin-right: auto;
}

#arrows {
  margin-top: -48px;
}

#up-arrow {
  /* margin-top: -335%; */
  animation: topArrow 1s ease-in-out infinite;
}

#down-arrow {
  margin-top: 15px;
  animation: botArrow 1s ease-in-out infinite;
}

.arrow {
  display: block;
}
.boxes {
  /* padding-left: calc(50% - 60vw / 2); */
  /* justify-content: center; */
  display: flex;
  justify-content: center;
}

.number-box,
.euro,
.comma,
.invisible-box {
  /* display: block; */
  margin: 15px;
  height: 15vh;
  width: 15vh;
  line-height: 15vh; /* text centering vertically */
  text-align: center; /* text centering vertically */
}

.invisible-box {
  /* background-color: #3624915e; */
  margin: 5px;
  height: calc(15vh + 20px);
  width: calc(15vh + 20px);
  justify-content: center;
}
.arrow {
  margin-left: calc((15vh / 2) - 20px);
}
.number-box,
.euro {
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
.comma {
  text-align: left;
  width: 5vh;
  background-color: transparent;
  box-shadow: none;
  color: white;
  text-shadow: 5px 5px #ff9900;
  font-family: pixel2;
  font-size: 10rem;
}

.active {
  line-height: calc(15vh + 20px); /* text centering vertically */
  background-color: #ffff08;
  box-shadow: 5px 10px #ffac30, 0 0 0, 7px 10px #ffac30, 0 0 0;
  margin: 5px;
  height: calc(15vh + 20px);
  width: calc(15vh + 20px);
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

.campaign-description {
  overflow: hidden;
  height: 255px;
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
  width: 70vw;
  height: 25vh;
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
