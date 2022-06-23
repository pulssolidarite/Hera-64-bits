<template>
	<div id="campaign-presentation-screen">
		<div id="aside">
			<AsideTop></AsideTop>
			<AsideBot></AsideBot>
		</div>
	
		<div id="small-carrousels" ref="smallCarrousel">
			<div class="wrapper" :style="smallCarrouselTranslate">
				<SmallCarrousel id="game-carrousel" :active="isActiveGamesCarrousel" :content="games" title="tous nos jeux" @carrouselChose="choseGame">
				</SmallCarrousel>
	
				<SmallCarrousel id="campaign-carrousel" :active="isActiveCampaignsCarrousel" :content="campaigns" title="toutes nos associations" @carrouselChose="choseCampaign">
				</SmallCarrousel>
			</div>
		</div>
	
		<div class="flipX" id="favorite">
			<div class="flip-inner" :class="isFliped ? 'fliped' : ''">
				<div class="flip-front">
					<Favorite v-if="activeComponent.content && !isFliped" :action="activeComponent.action" :content="activeComponent.content" :active="!isFliped && isFavActive" :favoriteButtons="activeComponent.buttons" @select="activeComponent.select"
					    @more="activeComponent.more" @back="activeComponent.back"></Favorite>
				</div>
				<div class="flip-back">
					<Favorite v-if="activeComponent.content && isFliped" :action="activeComponent.action" :content="activeComponent.content" :active="isFliped && isFavActive" :favoriteButtons="activeComponent.buttons" @select="activeComponent.select"
					    @more="activeComponent.more" @back="activeComponent.back"></Favorite>
				</div>
			</div>
		</div>
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="2" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import AsideTop from "@/components/new-theme/misc/aside/AsideTop.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import SmallCarrousel from "@/components/new-theme/misc/SmallCarrousel.vue";
import Favorite from "@/components/new-theme/misc/Favorite.vue";

const select = "select";
const more = "more";
const back = "back";

export default {
	watch: {
		selectedGame: function(newVal, oldVal) {
			this.$emit("saveGame", {game:newVal});
			if (newVal && this.selectedCampaign) {
				this.$emit("nextView");
			}
		},
		selectedCampaign: function(newVal, oldVal) {
			this.$emit("saveCampaign", {campaign:newVal});
			if (newVal && this.selectedGame) {
				this.$emit("nextView");
			}
		}
	},
	data() {
		return {
			gameButtons: [{ text: "jouer", action: select }, { text: "+ d'infos", action: more }],
			campaignButtons: [{ text: "choisir", action: select }, { text: "découvrir", action: more }],
			gameButtonsMore: [{ text: "jouer", action: select }, { text: "retour", action: back }],
			campaignButtonsMore: [{ text: "choisir", action: select }, { text: "retour", action: back }],
			activeComponent: {},
			selectedGame: null,
			selectedCampaign: null,
			activeItemIndex: 0,
			translateY: 0,
			carrouselHeight: 0, //don't change value after mounted()
			isFliped: false,
			isFavActive: true,
			isActiveGamesCarrousel: false,
			isActiveCampaignsCarrousel: false,
			smallCarrouselTranslate: "",
		}
	},
	components: {
		AsideTop,
		AsideBot,
		HelpGamepad,
		SmallCarrousel,
		Favorite,
	},
	props: [
		"games",
		"campaigns",
		"favoriteButtons",
	],
	created: function() {
		if (this.games) {
			this.activeComponent = { content: this.games[0], action: "present", buttons: this.gameButtons, select: this.selectGame, more: this.moreGame, back: this.backGame };
		}
		// console.log(this.activeComponent);
	},
	mounted: function() {
		// setTimeout(() => this.$emit("home"), 1000 * 60);
		this.translateY = this.getSmallCarrouselHeight();
		this.carrouselHeight = this.translateY;
	},
	methods: {
		toggleFlip: function() {
			this.isFliped = !this.isFliped;
		},
		choseGame: function(game) {
			console.log("chose game", game.name);
			this.selectGame({content: game});
			// this.selectedGame = game;
			// this.toggleFlip();
			// this.moveSelection(1);
		},
		choseCampaign: function(campaign) {
			console.log("chose camp", campaign.name);
			this.selectCampaign({content: campaign});
			// this.selectedCampaign = campaign;
			// this.moveSelection(-1);
		},
		selectGame: function(game) {
			console.log("select game", game.content.name);

			this.activeComponent.content = this.campaigns[0];
			this.activeComponent.action = "present";
			this.activeComponent.buttons = this.campaignButtons;
			this.activeComponent.select = this.selectCampaign;
			this.activeComponent.more = this.moreCampaign;
			this.activeComponent.back = this.backCampaign;

			this.toggleFlip();
			this.selectedGame = game.content;
			this.moveSelection(1);
			this.moveSelection(1);
			this.activeItemIndex = 0;
			this.isActiveGamesCarrousel = false;
			this.isActiveCampaignsCarrousel = false;
			this.isFavActive = true;
		},
		selectCampaign: function(campaign) {
			console.log("select campaign", campaign.content.name);

			this.selectedCampaign = campaign.content;
		},
		moreGame: function(element) {
			this.activeComponent.action = "more";
			this.activeComponent.buttons = this.gameButtonsMore
			// this.toggleFlip();
		},
		moreCampaign: function(element) {
			this.activeComponent.action = "more";
			this.activeComponent.buttons = this.campaignButtonsMore;
			// this.toggleFlip();
		},
		backGame: function(element) {
			this.activeComponent.action = "present";
			this.activeComponent.buttons = this.gameButtons;
			// this.toggleFlip();
		},
		backCampaign: function(element) {
			this.activeComponent.action = "present";
			this.activeComponent.buttons = this.campaignButtons;
			// this.toggleFlip();
		},
		simulate_a: function() {},
		simulate_b: function() {},
		simulate_up: function() {
			this.moveSelection(-1);
		},
		simulate_down: function() {
			this.moveSelection(1);
		},
		getSmallCarrouselHeight() {
			var carrousel = document.getElementById("small-carrousels");
			if (carrousel === undefined)
				return 0;
			return (parseInt(window.getComputedStyle(carrousel).height) + parseInt(window.getComputedStyle(carrousel).paddingBottom));
		},
		setSmallCarrouselHeightStyle() {
			if (this.isActiveCampaignsCarrousel)
				this.smallCarrouselTranslate = "transform: translateY(" + -this.translateY + "px);";
			else
				this.smallCarrouselTranslate = "transform: translateY(0px);";
		},
		moveSelection: function(direction) {
			if (direction != 1 && direction != -1)
				return;
			else {
				var limit = (direction == 1 ? 3 : -1);
				if (this.activeItemIndex + direction == limit)
					return;
				else
					this.activeItemIndex += direction;

				this.isFavActive = this.activeItemIndex == 0;
				this.isActiveGamesCarrousel = this.activeItemIndex == 1;
				this.isActiveCampaignsCarrousel = this.activeItemIndex == 2;

				this.setSmallCarrouselHeightStyle();
			}
		},
	},

}
</script>

<style scoped>
#campaign-presentation-screen{
	height: var(--max-h);
}

#small-carrousels {
	position: absolute;
	left: calc(var(--aside-w) + var(--margin));
	overflow: hidden;
	height: calc(2 * var(--margin) + var(--list-h));
	bottom: 0;
}

#game-carrousel,
#campaign-carrousel {
	padding-bottom: calc(2 * var(--margin));
}

.wrapper {
	transition-duration: var(--transition);
}
</style>