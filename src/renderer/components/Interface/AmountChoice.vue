<template>
  <div class="component">
    <div class="view amount-choice">
      <div class="container">
        <!-- title -->
        <div class="row">
          <div class="s-title">
            <div class="title">CHOISIS TON MONTANT</div>
            <div class="subtitle">
              <div class="">Vos dons sont reversés aux associations.</div>
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
            <div class="euro number-box">
              <div id="maxlimit" v-if="eurobox=='maxlimit'">
                Max.
                <br />
                {{ max_amount }}€
              </div>
              <div id="minlimit" v-if="eurobox=='minlimit'">
                Min.
                <br />
                {{ min_amount }}€
              </div>
              <div id="default" v-if="eurobox=='default'">€</div>
              <div id="start" v-if="eurobox=='start'">Start</div>
            </div>
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
                <span class="descr">{{ session.campaign.description }}</span>
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
      amount: [{ n: 0 }, { n: 1 }],
      max_amount: 50,
      min_amount: 1,
      eurobox: "default"
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
    setTimeout(() => this.$emit("home"), 1000 * 60);
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
    countAmount() {
      // return in cents : 1€ = 100
      var count = 0;
      var e = 1;
      this.amount.forEach(a => {
        count += a.n * 10 ** e;
        e--;
      });
      count = parseInt(count * 100);

      return count;
    },
    updateEurobox() {
      var count = this.countAmount() / 100;

      if (count < this.min_amount) {
        this.eurobox = "minlimit";
        document.getElementsByClassName("euro")[0].style.background = "red";
      } else if (count > this.max_amount) {
        this.eurobox = "maxlimit";
        document.getElementsByClassName("euro")[0].style.background = "red";
      } else {
        this.eurobox = "default";
        document.getElementsByClassName("euro")[0].style.background = "yellow";
      }
      console.log(this.eurobox);
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
      console.log(this.active_box);

      this.boxes[this.active_box].classList.toggle("active");
      this.boxes[this.active_box - direction].classList.toggle("active");
      this.moveArrows(direction);
    },
    moveArrows(direction = 1) {
      // console.log("this.boxes[this.active_box"+direction+"].offsetLeft = "+this.boxes[this.active_box + direction].offsetLeft);
      if (this.active_box < this.boxes.length - 1) {
        this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
      }
      if (
        this.eurobox == "default" &&
        this.active_box == this.boxes.length - 1
      ) {
        this.eurobox = "start";
        this.arrows.style.display = "none";
        this.boxes[this.boxes.length - 1].classList.toggle("start");
        this.boxes[this.boxes.length - 1].classList.toggle("default");
        document.getElementsByClassName("euro")[0].style.background = "#99c961";
      } else if (
        this.eurobox == "start" &&
        this.active_box < this.boxes.length
      ) {
        this.eurobox = "default";
        this.arrows.style.display = "block";
        this.boxes[this.boxes.length - 1].classList.toggle("start");
        this.boxes[this.boxes.length - 1].classList.toggle("default");
        document.getElementsByClassName("euro")[0].style.background = "#ffff60";
      }
    },
    incrementNum(incr = 1) {
      // incr is direction 1 or -1
      if ((incr != 1 && incr != -1) || this.active_box >= this.boxes.length - 1)
        return;
      console.log(this.active_box);

      if (this.amount[this.active_box].n == 0 && incr == -1)
        this.amount[this.active_box].n = 9;
      else
        this.amount[this.active_box].n =
          (this.amount[this.active_box].n + incr) % 10;

      this.updateEurobox();

      console.log("countAmount() = " + this.countAmount());
    },
    simulate_a() {
      if (this.active_box < this.boxes.length - 1) {
        this.nextBox(1);
      } else if (this.active_box == this.boxes.length - 1) {
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
      var box = document.getElementsByClassName("campaign-description")[0];
      var text = document.getElementsByClassName("descr")[0];

      console.log(text.offsetHeight + " " + box.offsetHeight);

      if (text.offsetHeight > box.offsetHeight)
        text.classList.add("animVerticalText");
    }
  }
};
</script>

<style scoped>
#start {
  font-size: 5vh;
}
#maxlimit,
#minlimit {
  font-size: 5vh;
  line-height: calc(18vh / 2);
}
.row {
  justify-content: center;
  margin-top: 3vh;
}
#payment-tool {
  margin-top: 5vh;
  margin-bottom: 5vh;
}
#arrows {
  line-height: 18vh;
  position: absolute;
  transition-duration: 0.3s;
}

.s-title {
  position: relative;
}

.s-title .subtitle {
  font-family: Pixel2;
  font-size: 3.5vh;
  margin-left: 0;
  max-width: 70vw;
  color: #c97005;
  white-space: nowrap;
  overflow: hidden;
}

.s-title .title {
  margin-left: 0;
}

.subtitle {
  font-size: 2em;
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
  margin-left: calc((18vh / 2) - 20px);
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
  height: 18vh;
  width: 18vh;
  line-height: 18vh; /* text centering vertically */
  text-align: center; /* text centering vertically */
}

.invisible-box {
  margin: 5px;
  height: calc(18vh + 20px);
  width: calc(18vh + 20px);
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
  line-height: calc(18vh + 20px); /* text centering vertically */
  background-color: #ffff08;
  box-shadow: 5px 10px #ffac30, 0 0 0, 7px 10px #ffac30, 0 0 0;
  margin: 5px;
  height: calc(18vh + 20px);
  width: calc(18vh + 20px);
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

.campaign-description {
  overflow: hidden;
  height: 18vh;
  margin-top: 2vh;
}

.amount-media {
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 1500px) {
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
  background-color: #512fb5;
  box-shadow: -5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491, 0px 5px #372491;
  width: 70vw;
  height: 22vh;
  overflow: hidden;
  font-family: pixel2;
  font-size: 2.5rem;
  color: white;
}

.content-line {
  height: 25vh;
  top: 19vw;
}

.content-slidebar {
  box-shadow: -8px 0px #775ce4, 0px -8px #775ce4, 8px 0px #372491, 0px 8px #372491;
}

.campaign-description {
  font-family: pixel3;
  color: white;
  font-size: 1.2rem;
}
</style>
