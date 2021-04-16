<template>
  <div class="component">
    <div class="view campaign-choice">
      <div class="s-title">
        <div class="title">CHOISIS TON ASSOCIATION</div>
        <div class="subtitle"></div>
      </div>

      <div class="s-content">
        <div class="carousel">
          <vueper-slides
            ref="carousel"
            class="no-shadow"
            :infinite="false"
            :visibleSlides="1"
            :fixedHeight="true"
            :bullets="false"
            :touchable="false"
            :gap="30"
            transition-speed="250"
            @ready="chooseCampaign($event.currentSlide.index)"
            @slide="chooseCampaign($event.currentSlide.index)"
          >
            <template v-slot:arrow-left>
              <div id="left-arrow" class="left-arrow"></div>
            </template>
            <template v-slot:arrow-right>
              <div id="right-arrow" class="right-arrow"></div>
            </template>

            <vueper-slide v-for="(campaign, i) in campaigns" :key="i">
              <template v-slot:content>
                <div class="carousel-content">
                  <div class="row title-a">{{ campaign.name }}</div>
                  <div class="row picture">
                    <youtube
                      v-show="campaign.is_video"
                      id="player-ytb"
                      :video-id="campaign.video"
                      :player-vars="playerVars"
                      :fitParent="true"
                      :ref="'youtube' + i"
                      @ready="playerReady(i)"
                      @playing="playerPlaying(i)"
                      @ended="playVideo(i)"
                      style="height: 100%; width: 100%;"
                    ></youtube>

                    <img
                      :src="campaign.logo"
                      :alt="campaign.name"
                      :class="[
                        'slide-picture',
                        campaign.is_video ? 'slide-picture-hidden' : '',
                      ]"
                    />
                  </div>
                  <div class="c-line"></div>
                  <div class="row infos">
                    <div class="icon1"></div>
                    <div class="mission"></div>
                    <div class="icon2"></div>
                    <div class="lieux"></div>
                  </div>
                  <div class="c-line"></div>
                  <div class="row descr">
                    <span class="slide-description">
                      {{ campaign.description }}
                    </span>
                  </div>
                </div>
              </template>
            </vueper-slide>
          </vueper-slides>
        </div>
      </div>

      <!-- GAMEPAD -->
      <helpGamepad
        @simulate_a="simulate_a"
        @simulate_b="simulate_b"
        @simulate_right="simulate_right"
        @simulate_left="simulate_left"
      />
    </div>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from "vueperslides";
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "CampaignChoice",
  components: { VueperSlides, VueperSlide, helpGamepad },
  props: ["campaigns", "session"],
  data: function() {
    return {
      choosenCampaign: {},
      choosenIndexOf: {
        campaigns: "",
      },
      timer: 0,
      time: 0,
      duration: 0,
      playerVars: {
        autoplay: 1,
        iv_load_policy: 3,
        playsinline: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
      },
      currentSlide: 0,
    };
  },
  mounted: function() {
    if (this.session.position_asso) {
      this.chooseCampaign(this.session.position_asso - 1);
    } else {
      this.chooseCampaign(0);
    }
    this.overflowVerify();
    setTimeout(() => this.$emit("home"), 1000 * 60);
    //this.videoSize();
  },
  methods: {
    simulate_a() {
      this.gotoPayment();
    },
    simulate_b() {
      this.$emit("lastView");
    },
    simulate_left() {
      this.$refs.carousel.previous();
      this.animateArrow("left");
    },
    simulate_right() {
      this.$refs.carousel.next();
      this.animateArrow("right");
    },
    chooseCampaign: function(index) {
      this.currentSlide = index;
      this.choosenCampaign = this.campaigns[index];
      this.choosenIndexOf.campaigns = index;

      // Saving
      this.$emit("saveCampaign", {
        campaign: this.choosenCampaign,
        indexOf: this.choosenIndexOf.campaigns + 1,
      });
    },
    playerReady: function(index) {
      this.$refs["youtube" + index][0].player.mute();
      this.$refs["youtube" + index][0].player.getDuration().then((resp) => {
        this.duration = resp;
      });
    },
    playerPlaying: async function(index) {
      let currentTime = this.$refs[
        "youtube" + index
      ][0].player.getCurrentTime();
      this.timer = (Math.ceil(currentTime) / this.duration) * 100;
    },
    playVideo(index) {
      this.$refs["youtube" + index][0].player.playVideo();
    },
    videoSize() {
      if (window.innerWidth / window.innerHeight < 1.4) {
        var video = document.getElementById("player-ytb");
        video.style.height = "315.3px";
        video.style.width = "448.41px";
      }
    },
    gotoPayment: function() {
      if (this.choosenCampaign != null) {
        this.$emit("startSession"); // Important to start the session here, for nice timers
        this.$emit("nextView");
      } else {
        this.$emit("error", {
          visible: true,
          title: "Aucun choix valide",
          errors: {},
        });
      }
    },
    animateArrow(dir) {
      // Animate Arrows
      if (dir == "left") {
        var arrow = document.getElementById("left-arrow");
      } else {
        var arrow = document.getElementById("right-arrow");
      }
      arrow.style.transform = "scale(1.4)";
      setTimeout(function() {
        arrow.style.transform = "scale(1)";
      }, 150);
    },
    overflowVerify() {
      var text = document.getElementsByClassName("slide-description");
      var box = document.getElementsByClassName("descr");
      for (let i = 0; i < text.length; i++) {
        if (text[i].offsetHeight > box[i].offsetHeight) {
          text[i].classList.add("animVerticalText");
        }
      }
    },
  },
};
</script>

<style scoped></style>
