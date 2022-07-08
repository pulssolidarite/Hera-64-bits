<template>
	<div id="game-selection">
	
	
		<div id="inline-stepping">
			<Step class="step active-step" num="1" big="jouer" small="une partie" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step" num="2" big="choisir" small="une association" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>
	
		<div>
			<BigCarrousel :content="content" :selectedElement="selectedGame" type="game" @chose="chose"></BigCarrousel>
		</div>

		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/bouton-A-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">choisir ce jeu</div>
				</div>
			</div>
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/bouton-X-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">choisir au hasard</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/exports/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<div class="gamepadControls">
			<div v-gamepad:button-x="simulate_b"></div>
		</div>
	</div>
</template>

<script>
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import Step from "@/components/new-theme/misc/Step.vue";
import BigCarrousel from "@/components/new-theme/misc/BigCarrousel.vue"
export default {
	mounted: function() {
		setTimeout(() => {
			this.$emit("home")
		}, 1000 * 60);
	},
	data() {
		return {
			stepSize: "80",
		}
	},
	components: {
		AsideBot,
		Step,
		BigCarrousel,
	},
	props: [
		"content",
		"selectedGame"
	],
	methods: {
		chose: function(game) {
			this.$emit("saveGame", game)
			this.$emit("nextView");
		},
		simulate_b: function() {
			this.$emit("lastView");
		}
	},
}
</script>

<style scoped>
#game-selection {
	height: var(--max-h);
}

</style>