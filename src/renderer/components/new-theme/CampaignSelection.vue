<template>
	<div id="campaign-selection">
	
		<div id="inline-stepping">
			<Step class="step" num="1" big="jouer" small="une partie" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step active-step" num="2" big="choisir" small="une association" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>
	
		<div>
			<BigCarrousel :content="content" :selectedElement="selectedCampaign" type="campaign" @chose="chose"></BigCarrousel>
		</div>
	
		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/fleche-bas-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">voir sa vidéo</div>
				</div>
			</div>
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/bouton-A-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">choisir cette association</div>
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
	
		<!-- GAMEPAD -->
		<!-- <helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_right="simulate_right" @simulate_left="simulate_left" /> -->
		<div class="gamepadControls">
			<div v-gamepad:button-x="simulate_b"></div>
		</div>
	</div>
</template>

<script>
// import HelpGamepad from "@/components/new-theme/misc/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import Step from "@/components/new-theme/misc/Step.vue";
import BigCarrousel from "@/components/new-theme/misc/BigCarrousel.vue"
export default {
	mounted: function() {
		setTimeout(() => {
			this.$emit("home")
		}, 1000 * 60 * 3);
	},
	data() {
		return {
			stepSize: "80",
		}
	},
	components: {
		// HelpGamepad,
		AsideBot,
		Step,
		BigCarrousel,
	},
	props: [
		"content",
		"selectedCampaign"
	],
	methods: {
		chose: function(campaign) {
			this.$emit("saveCampaign", campaign);
			this.$emit("startSession"); // Important to start the session here, for nice timers
			this.$emit("nextView");
		},
		simulate_b: function() {
			this.$emit("lastView");
		},
	},
}
</script>

<style scoped>
#campaign-selection {
	height: var(--max-h);
}
</style>