<template>
  <div id="home">

    <Error
		style="z-index: 999;"
		:visible="errors.visible"
		:title="errors.title"
		:errors="errors.errors"
		@home="homeView"
		@lastView="lastView"
    ></Error>

    <div :class="errors.visible ? 'blurred-screen' : ''" v-if="!loading">
      <transition name="mytr" mode="out-in">

		<IntroVideo
			v-if="viewIndex == -1"
			@nextView="nextView">
		</IntroVideo>

		<PresentationScreen
			:games="games"
			:campaigns="campaigns"
			@saveGame="saveGame"
			@saveCampaign="saveCampaign"
			@error="handleError"
			@nextView="nextView"
			@lastView="lastView"
			v-if="viewIndex == 0">
		</PresentationScreen>

		<GameSelection
			:content="games"
			:selectedGame="session.game"
			@saveGame="saveGame"
			@error="handleError"
			@nextView="nextView"
			@lastView="lastView"
			@home="homeView"
			v-if="viewIndex == 1">
		</GameSelection>

		<CampaignSelection
			:content="campaigns"
			:selectedCampaign="session.campaign"
			@saveCampaign="saveCampaign"
			@error="handleError"
			@nextView="nextView"
			@lastView="lastView"
			@home="homeView"
			v-if="viewIndex == 2">
		</CampaignSelection>

		<PaymentScreen
			:session="session"
			@saveAmount="saveAmount"
			@error="handleError"
			@nextView="nextView"
			@lastView="lastView"
			@home="homeView"
			v-if="viewIndex == 3"
        ></PaymentScreen>

		<PaymentInstruction
			:session="session"
			@nextView="nextView"
			@error="handleError"
			@lastView="lastView"
			@savePayment="savePayment"
			@home="homeView"
			v-if="viewIndex == 4"
        ></PaymentInstruction>

		<PadLayoutScreen
			:session="session"
			@nextView="nextView"
			v-if="viewIndex == 5">
		</PadLayoutScreen>

		<PlayGame
			:session="session"
			@error="handleError"
			@nextView="nextView"
			@lastView="lastView"
			@home="homeView"
			v-if="viewIndex == 6"
        ></PlayGame>
      </transition>
    </div>
  </div>
</template>

<script>
import Error from "@/components/misc/ErrorModal.vue";
import IntroVideo from "@/components/IntroVideo.vue";
import PresentationScreen from "@/components/PresentationScreen.vue";
import GameSelection from "@/components/GameSelection.vue";
import CampaignSelection from "@/components/CampaignSelection.vue";
import PaymentInstruction from "@/components/PaymentInstruction.vue";
import PaymentScreen from "@/components/PaymentScreen.vue";
import PlayGame from "@/components/PlayGame.vue";
import PadLayoutScreen from "@/components/PadLayoutScreen.vue";

const fs = require("fs");
const request = require("request");

export default {
  name: "Home",
  components: {
    Error,
	IntroVideo,
	PresentationScreen,
	GameSelection,
	CampaignSelection,
	PaymentInstruction,
	PaymentScreen,
	PlayGame,
	PadLayoutScreen,
  },
  data: function() {
    return {
      loading: false,
      errors: {
        visible: false,
        title: "",
        errors: {},
      },
      terminal: {},
      campaigns: [],
      games: [],
      viewIndex: 2, // Starting index
      maxViewIndex: 6,
      isAdmin: this.$store.getters.isAdmin,
      isLoggedIn: this.$store.getters.isLoggedIn,
      session: {
        terminal: {},
        campaign: {},
        game: {},
        donator: {},
        amount: null,
        start_global: null,
        end_global: null,
        start_time: null,
        end_time: null,
        position_asso: null,
        position_game: null,
      },
    };
  },
  mounted: function() {
    this.session = {
      terminal: {},
      campaign: {},
      game: {},
      donator: {},
      amount: null,
      start_global: null,
      end_global: null,
      start_time: null,
      end_time: null,
      position_asso: null,
      position_game: null,
    };
    this.loading = true;
    // First checking if logged in
    if (!this.isLoggedIn) {
      this.$router.push("/login");
    }

    // Loading all the data from API
    this.loading = true;
    this.$http
      .get("terminal/mine/")
      .then((resp) => {
        this.terminal = resp.data.terminal;
        // console.log(this.terminal);
        
        this.session.terminal = this.terminal;
        this.campaigns = resp.data.campaigns;
        // console.log(resp.data.campaigns);
        
        this.games = resp.data.games;

	// console.log(`user/${this.session.terminal.owner}`);
		this.$http
		.get(`customer/user/${this.session.terminal.owner}`)
		.then((resp) => {
			this.session.terminal.owner = resp.data;
		});

        // TEST-ONLY : we get the subscription type here
        // console.log("Type d'offre : " + this.terminal.subscription_type);

        // Core & Game management
        // Here we check if have all the required game files before turning the terminal on
        // bioses go in the same dir as the games
        const pathGlobal = process.env.HOME + "/games/";
        const pathRoms = pathGlobal + "roms/";
        const pathCores = pathGlobal + "cores/";
        const pathBios = pathGlobal + "roms/";

        // Creating folders if they don't exist
        if (!fs.existsSync(pathGlobal)) {
          fs.mkdirSync(pathGlobal);
        }
        if (!fs.existsSync(pathRoms)) {
          fs.mkdirSync(pathRoms);
        }
        if (!fs.existsSync(pathCores)) {
          fs.mkdirSync(pathCores);
        }
        if (!fs.existsSync(pathBios)) {
          fs.mkdirSync(pathBios);
        }

        this.games.forEach((game) => {
          // Checking if the game exists
          var currentPath = pathRoms + game.path;

          try {
            if (!fs.existsSync(currentPath)) {
              request(game.file.file).pipe(fs.createWriteStream(currentPath));
            }
          } catch (err) {
            console.error("Cought error on try : " + err);
          }

          // Checking if the Core exists
          currentPath = pathCores + game.core.path;
          try {
            if (!fs.existsSync(currentPath)) {
              request(game.core.file.file).pipe(
                fs.createWriteStream(currentPath)
              );
            }
          } catch (err) {
            console.error("Catched error on try : " + err);
          }

          // Checking if the Core exists
          if (game.core.bios_path) {
            currentPath = pathBios + game.core.bios_path;
            try {
              if (!fs.existsSync(currentPath)) {
                request(game.core.bios.file).pipe(
                  fs.createWriteStream(currentPath)
                );
              }
            } catch (err) {
              console.error("Catched error on try : " + err);
            }
          }
        });

        // Random appearance of games and campaigns
        this.shuffleArray(this.campaigns);
        this.shuffleArray(this.games);

        // Switching on the terminal
        this.$http.get("terminal/mine/on/");

        // Stop the loading spinner
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.errors = {
          visible: true,
          title: "Erreur de chargement",
          errors: err.response.data,
        };
        this.loading = false;
      });
  },
  methods: {
    // CHOICE METHODS
    saveGame: function(game) {
      this.session.game = game;
      this.session.position_game = 1 + this.games.indexOf(game);
	//   console.log(game.name);
    },
    saveCampaign: function(campaign) {
      this.session.campaign = campaign;
      this.session.position_asso = 1 + this.campaigns.indexOf(campaign);
	//   console.log(campaign.name);
    },
    saveAmount: function(payload) {
      this.session.amount = payload.amount;
    },
    savePayment: function(payload) {
      // Saving the payment right away, avoiding to loose sensitive data
      this.loading = true;
      this.$http
        .post("payment/", payload.payment)
        .then((resp) => {
          if (resp.status == "201") {
            this.loading = false;
            this.nextView();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.errors = {
            visible: true,
            title: "Erreur d'enregistrement",
            errors: err.response.data,
          };
        });
    },

    // SESSION SPECIFIC METHODS
    startSession: function() {
      this.loading = true;
      // Creating a new donator for the session
      this.$http
        .post("donator/", {})
        .then((resp) => {
          // this.session.terminal = this.terminal; // Binding the terminal to the session
          this.session.start_global = new Date(); // Starting global timer for session
          this.session.donator = resp.data; // Binding the donator to the session
          this.loading = false;
        })
        .catch((err) => {
          this.errors = {
            visible: true,
            title: "Erreur de session",
            errors: err.response.data,
          };
          this.loading = false;
        });
    },
    startGameSession: function() {
      this.session.start_time = new Date(); // Starting gaming timer for session
      this.$http
        .get("terminal/mine/play/")
        .then()
        .catch((err) => {
          this.errors = {
            visible: true,
            title: "Erreur de status de jeu",
            errors: err.response.data,
          };
        }); // Activating Playing status on backend
    },
    endGameSession: function() {
      this.session.end_time = new Date(); // Ending gaming timer for session
      this.$http.get("terminal/mine/gameover/").catch((err) => {
        this.errors = {
          visible: true,
          title: "Impossible d'éteindre la borne",
          errors: err.response.data,
        };
      });
    },
    endSession: function() {
      this.session.end_global = new Date(); // Ending global timer for session
      this.session.terminal = this.session.terminal.id;
      this.session.donator = this.session.donator.id;
      this.session.campaign = this.session.campaign.id;
      this.session.game = this.session.game.id;

      this.$http.post("session/", this.session).catch((err) => {
        this.errors = {
          visible: true,
          title: "Erreur de sauvegarde de session",
          errors: err.response.data,
        };
      });
    },

    // ERROR SPECIFIC METHODS
    handleError: function(payload) {
      this.errors = payload;
    },

    // ALL GENERAL METHODS
    nextView: function() {
      if (this.viewIndex < this.maxViewIndex) {
        this.viewIndex += 1;
      } else {
        this.viewIndex = 0;
      }
    },
    lastView: function() {
      if (this.viewIndex > -1) {
        this.viewIndex -= 1;
      }
      this.errors = {
        visible: false,
        title: "",
        errors: [],
      };
    },
    replay: function() {
      this.startSession();
      this.viewIndex = 2; // 2 if you want to replay from amount choice
    },
    moreInfo: function() {
      this.viewIndex = 8;
    },
    endedView() {
      this.viewIndex = 6;
    },
    homeView() {
      this.viewIndex = 0;
      this.errors = {
        visible: false,
        title: "",
        errors: [],
      };
    },
    ticket_request: function() {
      this.viewIndex = 7;
    },
    shuffleArray: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
  },
};
</script>
