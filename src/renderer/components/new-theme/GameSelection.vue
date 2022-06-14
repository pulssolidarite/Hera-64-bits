<template>
	<div id="game-selection">
		<div id="aside">
			<div id="logo">
				<img src="">
			</div>
			<AsideBot></AsideBot>
		</div>

		<div id="inline-stepping" :style="'margin-top: '+stepSize/2+'px;'">
			<Step class="step" num="1" big="jouer" small="une partie" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line"><hr></div>
			<Step class="step" num="2" big="choisir" small="une association" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line"><hr></div>
			<Step class="step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>

		<div id="big-carrousel">
			
		</div>

		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_right="simulate_right" @simulate_left="simulate_left" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import Step from "@/components/new-theme/misc/Step.vue";

export default {
  data () {
    return {
		stepSize: "80",
    }
  },
	components: {
		HelpGamepad,
		AsideBot,
		Step,
	},
	props: [
		"content",
	],
	methods: {
		simulate_a: function() {
			this.$emit("nextView");
		},
		simulate_b: function() {
			this.$emit("lastView");
		},
		simulate_left: function() {},
		simulate_right: function() {},
	},
}
</script>

<style>

#inline-stepping>.step{
	background: var(--bg-color);
	padding: 0 var(--margin) 0 var(--margin);
}

.line{
	padding: 0;
	width:calc(var(--inline-stepping-w) / 2);
	transform: translateY(calc(-1 * var(--margin)));
}
	.line hr{
		border: 3px solid var(--blue-color);
	}
</style>