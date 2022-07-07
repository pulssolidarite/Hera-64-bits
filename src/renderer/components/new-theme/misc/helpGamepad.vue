<template>
	<div id="help-gamepad">
	
		<div @keydown="keyboardEventListener"></div>
	
		<span v-gamepad:left-analog-left="simulate_left" v-gamepad:right-analog-left="simulate_left"></span>
		<span v-gamepad:right-analog-up="simulate_up" v-gamepad:left-analog-up="simulate_up"></span>
		<span v-gamepad:left-analog-down="simulate_down" v-gamepad:right-analog-down="simulate_down"></span>
		<span v-gamepad:left-analog-right="simulate_right" v-gamepad:right-analog-right="simulate_right"></span>
	
		<div v-gamepad:button-b="simulate_a"></div>
		<div v-gamepad:button-x="simulate_b"></div>
	
	</div>
</template>

<script>
export default {
	watch: {
		gp: (newVal, oldVal) => {
			console.log(newVal);
		}
	},
	name: "helpGamepad",
	props: {},
	data() {
		return {
		};
	},
	mounted() {},
	created() {
		window.addEventListener("keydown", this.keyboardEventListener);
		
	},
	beforeDestroy: function() {
		window.removeEventListener("keydown", this.keyboardEventListener);
	},
	methods: {
		keyboardEventListener: function(key) {
			// return window.addEventListener("keydown", function(key){
			var k = key.key;
			var c = key.keyCode; // for directional arrows

			if (k == "a" || k == "A") {
				console.log("a");
				this.$emit("simulate_a");
			} else if (k == "b" || k == "B") {
				// console.log("b");
				this.$emit("simulate_b");
			} else if (k == "x" || k == "X") {
				// console.log("x");
				this.$emit("simulate_x");
			} else if (c == 39) {
				// console.log("right");
				this.$emit("simulate_right");
			} else if (c == 37) {
				// console.log("left");
				this.$emit("simulate_left");
			} else if (c == 38) {
				// console.log("up");
				this.$emit("simulate_up");
			} else if (c == 40) {
				// console.log("down");
				this.$emit("simulate_down");
			}
			// })
		},
		simulate_a: function() {
			console.log("a");
			this.$emit("simulate_a");
		},
		simulate_b: function() {
			console.log("b");
			this.$emit("simulate_b");
		},
		simulate_left: function() {
			console.log("left");
			this.$emit("simulate_left");
		},
		simulate_right: function() {
			console.log("right");
			this.$emit("simulate_right");
		},
		simulate_up: function() {
			console.log("up");
			this.$emit("simulate_up");
		},
		simulate_down: function() {
			console.log("down");
			this.$emit("simulate_down");
		},
	}
};
</script>

<style scoped>
#help-gamepad {
	display: none;
}
</style>
