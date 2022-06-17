<template>
	<div id="campaign-presentation-screen">
		<div id="aside">
			<AsideTop></AsideTop>
			<AsideBot></AsideBot>
		</div>
	
		<div id="small-carrousels" ref="smallCarrousel">
			<div class="wrapper" :style="smallCarrouselTranslate">
				<SmallCarrousel id="game-carrousel" :active="isActiveGamesCarrousel" :content="games" title="tous nos jeux" @chose="choseGame">
				</SmallCarrousel>
	
				<SmallCarrousel id="campaign-carrousel" :active="isActiveCampaignsCarrousel" :content="campaigns" title="toutes nos associations" @chose="choseCampaign">
				</SmallCarrousel>
			</div>
		</div>
	
		<div class="flipX" id="favorite">
			<div class="flip-inner" :class="isFliped ? 'fliped' : ''">
				<div class="flip-front">
					<Favorite v-if="activeComponent.content && !isFliped" :action="activeComponent.action" :content="activeComponent.content" :active="!isFliped && isFavActive" :favoriteButtons="activeComponent.buttons" @select="activeComponent.select" @more="activeComponent.more" @back="activeComponent.back"></Favorite>
				</div>
				<div class="flip-back">
					<Favorite v-if="activeComponent.content && isFliped" :action="activeComponent.action" :content="activeComponent.content" :active="isFliped && isFavActive" :favoriteButtons="activeComponent.buttons" @select="activeComponent.select" @more="activeComponent.more" @back="activeComponent.back"></Favorite>
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
	created: function(){
		if (this.games){
			this.activeComponent = {content:this.games[0], action:"present", buttons:this.gameButtons, select:this.selectGame, more:this.moreGame, back:this.backGame};
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
		selectGame: function(element) {
			this.selectedGame = element;
			this.activeComponent = {content:this.campaigns[0], action:"present", buttons:this.campaignButtons, select:this.selectCampaign, more:this.moreCampaign, back:this.backCampaign};
			this.toggleFlip();
			this.setSmallCarrouselHeightStyle(true);
		},
		selectCampaign: function(element) {
			this.selectedCampaign = element;
			this.activeComponent = {content:this.games[0], action:"present", buttons:this.gameButtons, select:this.selectGame, more:this.moreGame, back:this.backGame};
			
			if (this.selectedCampaign && this.selectedGame){
				this.$emit("nextView");
			}
		},
		moreGame: function(element) {
			this.activeComponent.action = "more";
			this.activeComponent.buttons = this.gameButtonsMore
			this.toggleFlip();
		},
		moreCampaign: function(element) {
			this.activeComponent.action = "more";
			this.activeComponent.buttons = this.campaignButtonsMore;
			this.toggleFlip();
		},
		backGame: function(element) {
			this.activeComponent.action = "present";
			this.activeComponent.buttons = this.gameButtons;
			this.toggleFlip();
		},
		backCampaign: function(element) {
			this.activeComponent.action = "present";
			this.activeComponent.buttons = this.campaignButtons;
			this.toggleFlip();
		},
		choseGame(game) {
			this.selectGame(game);
		},
		choseCampaign(campaign) {
			this.$emit("saveCampaign", campaign);
			this.$emit("nextView");
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
		setSmallCarrouselHeightStyle(condition) {
			if (condition)
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

				this.setSmallCarrouselHeightStyle(this.isActiveCampaignsCarrousel);
			}
		},
	},

}
</script>

<style>
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