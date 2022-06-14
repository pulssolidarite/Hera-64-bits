<template>
	<div id="campaign-presentation-screen">
		<div id="aside">
			<AsideTop></AsideTop>
			<AsideBot></AsideBot>
		</div>
	
		<div id="small-carrousels" ref="smallCarrousel">
			<div class="wrapper" :style="getSmallCarrouselHeightStyle()">
				<SmallCarrousel
					id="game-carrousel"
					:content="games"
					:active="isActiveGamesCarrousel"
					title="tous nos jeux"
					@chose="choseGame">
				</SmallCarrousel>

				<SmallCarrousel
					id="campaign-carrousel"
					:content="campaigns"
					:active="isActiveCampaignsCarrousel"
					title="toutes nos associations"
					@chose="choseCampaign">
				</SmallCarrousel>
			</div>
		</div>

		<Favorite :content="games ? games[0] : {}" :active="isActiveFavorite" :favoriteButtons="gameButtons"></Favorite>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="2" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import AsideTop from "@/components/new-theme/misc/aside/AsideTop.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import SmallCarrousel from "@/components/new-theme/misc/SmallCarrousel.vue";
import Favorite from "@/components/new-theme/Favorite.vue";

export default {
	data() {
		return {
			isActiveFavorite: true,
			isActiveGamesCarrousel: false,
			isActiveCampaignsCarrousel: false,
			gameButtons:[{text:"jouer"},{text:"+ d'infos"}],
			campaignButtons:[{text:"découvrir"}],
			activeItemIndex: 0,
			translateY: 0,
			carrouselHeight: 0,
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
	mounted: function() {
		setTimeout(() => this.$emit("home"), 1000 * 60);
		this.translateY = this.getSmallCarrouselHeight();
		this.carrouselHeight = this.translateY;
	},
	methods: {
		choseGame(game){
			// console.log(game);
			this.$emit("saveGame", game);
			this.$emit("nextView");
		},
		choseCampaign(campaign){
			// console.log(campaign);
			this.$emit("saveCampaign", campaign);
			this.$emit("nextView");
		},
		simulate_a: function() {
		},
		simulate_b: function() {
		},
		simulate_up: function() {
			this.moveSelection(-1);
		},
		simulate_down: function() {
			this.moveSelection(1);
		},
		getSmallCarrouselHeight(){
			var carrousel = document.getElementById("small-carrousels");
			if (carrousel === undefined)
				return 0;
			return (parseInt(window.getComputedStyle(carrousel).height) + parseInt(window.getComputedStyle(carrousel).paddingBottom));
		},
		getSmallCarrouselHeightStyle(){
			if (this.isActiveCampaignsCarrousel)
				return	"transform: translateY("+ -this.translateY +"px);";
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
				
				this.isActiveFavorite = this.activeItemIndex == 0;
				this.isActiveGamesCarrousel = this.activeItemIndex == 1;
				this.isActiveCampaignsCarrousel = this.activeItemIndex == 2;
			}
		},
	},

}
</script>

<style>
#small-carrousels{
	position: absolute;
	left: calc(var(--aside-w) + var(--margin));
	overflow: hidden;
	height:calc(2 * var(--margin) + var(--list-h));
	bottom: 0;
}
#game-carrousel, #campaign-carrousel{
	padding-bottom: calc(2 * var(--margin));
}
.wrapper{
	transition-duration: 0.5s;
}
</style>