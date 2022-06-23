<template>
	<div id="game-selection">
	
	
		<div id="inline-stepping" :style="'margin-top: '+stepSize/2+'px;'">
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
			<BigCarrousel :content="content" :selectedElement="selectedGame" @chose="chose"></BigCarrousel>
		</div>

		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src=""></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">choisir ce jeu</div>
				</div>
			</div>
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src=""></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">choisir au hasard</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_right="simulate_right" @simulate_left="simulate_left" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import Step from "@/components/new-theme/misc/Step.vue";
import BigCarrousel from "@/components/new-theme/misc/BigCarrousel.vue"
export default {
	data() {
		return {
			stepSize: "80",
		}
	},
	components: {
		HelpGamepad,
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
			this.$emit("saveGame", { game: game })
			this.$emit("nextView");
		},
		simulate_a: function() {},
		simulate_b: function() {
			this.$emit("lastView");
		},
		simulate_left: function() {},
		simulate_right: function() {},
	},
}
</script>

<style scoped>
#game-selection {
	height: var(--max-h);
}

#inline-stepping>.step {
	background: var(--bg-color);
	padding: 0 var(--margin) 0 var(--margin);
}

.line {
	padding: 0;
	width: calc(var(--inline-stepping-w) / 2);
	transform: translateY(calc(-1 * var(--margin)));
}

.line hr {
	border: 3px solid var(--blue-color);
}
</style>