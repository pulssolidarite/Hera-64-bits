<template>
	<div>
		<div id="aside">
			<div id="logo">
				<img src="">
			</div>
			<AsideBot></AsideBot>
		</div>
		<div class="steps">
			<Step num="1" big="jouer" small="une partie"></Step>
			<Step num="2" big="choisir" small="une association"></Step>
			<Step num="3" big="réaliser" small="un don"></Step>
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
	components: {
		HelpGamepad,
		AsideBot,
		Step,
	},
	props: [
		"content",
	],
	methods: {
		simulate_a: function() {},
		simulate_b: function() {
			this.$emit("lastView");
		},
		simulate_left: function() {},
		simulate_right: function() {},
	},
}
</script>

<style>
</style>