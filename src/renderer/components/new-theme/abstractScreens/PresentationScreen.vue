<template>
	<div id="campaign-presentation-screen">
		<div id="aside">
			<AsideTop></AsideTop>
			<AsideBot></AsideBot>
		</div>
	
		<Favorite :content="content ? content[0] : {}" :active="isActiveFavorite"></Favorite>
	
		<SmallCarrousel :content="content" :active="isActiveCarrousel"></SmallCarrousel>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="2" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	</div>
</template>

<script>
import AsideTop from "@/components/new-theme/aside/AsideTop.vue";
import AsideBot from "@/components/new-theme/aside/AsideBot.vue";
import HelpGamepad from "@/components/helpGamepad.vue";
import SmallCarrousel from "@/components/new-theme/SmallCarrousel.vue";
import Favorite from "@/components/new-theme/Favorite.vue";

export default {
	data() {
		return {
			isActiveFavorite: true,
			isActiveCarrousel: false,
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
		"content",
	],
	mounted: function() {
		setTimeout(() => this.$emit("home"), 1000 * 60);
	},
	methods: {
		simulate_a: function() {
			console.log("a");
			// this.$emit("nextView");
		},
		simulate_b: function() {
			console.log("b");
			// this.$emit("lastView");
		},
		simulate_up: function() {
			console.log("up");
			this.toggleActiveBlock();
		},
		simulate_down: function() {
			console.log("down");
			this.toggleActiveBlock();
		},
		toggleActiveBlock: function() { // ensures that isActiveCarrousel != isActiveFavorite
			this.isActiveCarrousel = !this.isActiveCarrousel;
			this.isActiveFavorite = !this.isActiveCarrousel;
			console.log("this.isActiveCarrousel :"+this.isActiveCarrousel)
			console.log("this.isActiveFavorite :"+this.isActiveFavorite)
		}
	},

}
</script>

<style>

.game-list {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
}

.small-card {
	flex-shrink: 0;
}

.small-card img {
	height: 20px;
	width: 20px;
}
</style>