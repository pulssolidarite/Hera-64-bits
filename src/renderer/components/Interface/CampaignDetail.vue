<template>
  <div class="component">
    <div class="d-flex flex-column h-100 bg-gradient">
      <div class="view position-relative d-flex flex-column align-items-center">
        <div class="ribbon left">
          <span class="h3 mr-3 mb-4">Merci !</span>
        </div>

        <div
          class="row d-flex align-items-center justify-content-around pt-5 w-100"
        >
          <span
            class="col-4 offset-1 h3 mt-3 text-uppercase text-center d-flex flex-column align-items-center"
          >
          </span>
          <div class="col-2 offset-5">
            <div class="logo-circle">
              <img :src="session.campaign.logo" :alt="session.campaign.title" />
            </div>
          </div>
        </div>
        <div class="container my-3 h-100 text-center">
          <youtube
            v-if="session.campaign.is_video"
            :video-id="session.campaign.video"
            :player-vars="playerVars"
            :fitParent="true"
            ref="youtube"
            @ready="playerReady()"
            @playing="playerPlaying()"
            style="width:320px; height:180px "
          ></youtube>
          <div class="w-100" v-else>
            <img
              :src="session.campaign.featured_image"
              class="img-fluid"
              :alt="session.campaign.name"
            />
          </div>
        </div>
        <div class="container mb-5 pb-3 mt-2 text-center">
          <div class="progress mb-5" style="height: 30px;">
            <div
              class="progress-bar bg-warning"
              role="progressbar"
              :style="{ width: timer + '%' }"
              :aria-valuenow="timer"
              aria-valuemin="0"
              :aria-valuemax="duration"
            >
              Chargement..
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CampaignDetail",
  props: ["session"],
  data: function() {
    return {
      timer: 0,
      time: 0,
      duration: 0,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
      },
    };
  },
  methods: {
    playerReady: function() {
      this.$refs.youtube.player.getDuration().then((resp) => {
        this.duration = resp;
      });
    },
    playerPlaying: async function() {
      var interval = setInterval(() => {
        this.$refs.youtube.player.getCurrentTime().then((resp) => {
          this.timer = (Math.ceil(resp) / this.duration) * 100;
        });
        if (this.timer >= 99) {
          clearInterval(interval);
          this.gotoPlay();
        }
      }, 100);
    },
    gotoPlay: function() {
      setInterval(() => {
        this.$emit("nextView");
      }, 600);
    },
  },
};
</script>
