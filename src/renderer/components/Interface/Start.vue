<template>
  <div class="component">
    <div class="view game-choice">
      <div class="s-title">
        <div class="title">CHOISIS TON JEU</div>
        <div class="subtitle">1 partie = {{this.session.terminal.play_timer}} minutes</div>
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
            :transition-speed="300"
            @ready="chooseGame($event.currentSlide.index)"
            @slide="chooseGame($event.currentSlide.index)"
          >
            <template v-slot:arrow-left>
              <div id="left-arrow" class="left-arrow"></div>
            </template>
            <template v-slot:arrow-right>
              <div id="right-arrow" class="right-arrow"></div>
            </template>

            <vueper-slide v-for="(game, i) in games" :key="i">
              <template v-slot:content>
                <div class="carousel-content">
                  <div class="row title-g">{{ game.name }}</div>
                  <div class="row picture">
                    <youtube
                      v-show="game.is_video"
                      id="player-ytb"
                      :video-id="game.video"
                      :player-vars="playerVars"
                      :fitParent="true"
                      :ref="'youtube' + i"
                      @ready="playerReady(i)"
                      @playing="playerPlaying(i)"
                      @ended="playVideo(i)"
                      style="height: 100%; width: 100%;"
                    ></youtube>

                    <img
                      :src="game.logo"
                      :alt="game.name"
                      :class="[
                        'slide-picture',
                        game.is_video ? 'slide-picture-hidden' : '',
                      ]"
                    />
                  </div>
                  <div class="c-line"></div>
                  <div class="row infos">
                    <!-- <div class="icon1"> <img src="@/assets/img/picto/gamepad.png" alt="gamepad pictograme" class="pictogramme"></div>
                      <div class="nb-j"> {{gameInfos[game.name].nb_player}}</div>
                      <div class="icon2"> <img src="@/assets/img/picto/gamepad.png" alt="gamepad pictograme" class="pictogramme"></div>
                      <div class="type"> {{gameInfos[game.name].type}} </div> -->
                    <div class="icon1">
                      <img
                        class="pictogramme"
                        src="@/assets/img/picto/gamepad.png"
                        alt="gamepad pictograme"
                      />
                    </div>
                    <div class="nb-j">x{{ game.nb_players }}</div>
                    <div class="type">{{ game.type }}</div>
                    <div class="icon2">
                      <!-- <img class="pictogramme" :src="'@/assets/img/picto/' + gameInfos[game.name].type + '.png'" :alt=game.name> -->
                      <!-- {{pathToPicto + gameInfos[game.name].type + '.png" alt="gamepad pictograme">'}} -->
                      <img
                        class="pictogramme"
                        :src="getPictoUrl(game)"
                        :alt="game.name"
                      />
                    </div>
                  </div>
                  <div class="c-line"></div>
                  <div class="row descr">
                    <span class="slide-description">
                      {{ game.description }}
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
        :gpio_help="1"
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
import { VueperSlides, VueperSlide } from "vueperslides";
//import jsonKeys from "./games_infos.json";

export default {
  name: "Start",
  components: { VueperSlides, VueperSlide, helpGamepad },
  props: ["games", "session"],
  data: function() {
    return {
      choosenGame: {},
      choosenIndexOf: {
        games: "",
      },
      playerVars: {
        autoplay: 1,
        iv_load_policy: 3,
        playsinline: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
      },
      //gameInfos: jsonKeys,
      pathToPicto: '<img class="pictogramme" src="@/assets/img/picto/',
    };
  },
  mounted: function() {
    if (this.session.position_game) {
      this.chooseGame(this.session.position_game - 1);
    } else {
      this.chooseGame(0);
    }
    this.overflowVerify();
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
    // SIMULATE GAMEPAD METHODS
    simulate_a() {
      this.gotoCampaign();
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
    getPictoUrl(game) {
      var images = require.context("@/assets/img/picto", false, /\.png$/);
      return images("./" + game.type + ".png");
      // return '@/assets/img/picto/' +  this.gameInfos[game.name].type + '.png';
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
    // OTHER METHODS
    chooseGame: function(index) {
      this.choosenGame = this.games[index];
      this.choosenIndexOf.games = index;

      // Saving
      this.$emit("saveGame", {
        game: this.choosenGame,
      });
    },
    gotoCampaign: function() {
      if (this.choosenGame != null) {
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
