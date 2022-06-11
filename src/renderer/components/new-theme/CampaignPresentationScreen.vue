<template>
	<div>
		<PresentationScreen :content="content" :favoriteButtons="favoriteButtons"></PresentationScreen>
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="2" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	
	</div>
</template>

<script>
import PresentationScreen from "@/components/new-theme/abstractScreens/PresentationScreen"
import HelpGamepad from "@/components/helpGamepad.vue";

export default {
  data () {
    return {
		favoriteButtons:[{text:"découvrir"}],
    }
  },
	props: [
		"content"
	],
	components: {
		PresentationScreen,
		HelpGamepad,
	},
	methods: {
		simulate_a: function() {
			console.log("a");
			this.$emit("nextView");
		},
		simulate_b: function() {
			console.log("b");
			this.$emit("lastView");
		},
		simulate_up: function() {
			console.log("up");
			// this.toggleActiveBlock();
		},
		simulate_down: function() {
			console.log("down");
			// this.toggleActiveBlock();
		},
	},
}
</script>