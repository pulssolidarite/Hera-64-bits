<template>
	<div class="bold-font fav-button big-font" :class="isActiveButton()">
		
		{{ button.text }}

		<!-- GAMEPAD -->
		<helpGamepad v-if="active" :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";

export default {
	components: {
		HelpGamepad,
	},
	methods: {
		simulate_a() {
			if (this.active){
				// console.log("btn:",this.button.action);
				this.$emit("selection", this.button.action);
			}
		},
		simulate_b() {},
		simulate_left() {
		},
		simulate_right() {
		},

		isActiveButton: function() {
			return this.active ? "active-button" : "inactive-button";
		},
	},
	props: [
		"button",
		"active",
		
	]
}
</script>

<style scoped>
.active-button,
.inactive-button{
	transition: all var(--transition) ease;
}
.fav-button {
	--height: 20px;
	display: inline-block;
	padding: var(--height);
	border-radius: calc(var(--height) * 2);
	margin-right: var(--height);
}

.fav-button:after {
	margin-left: 50px;
	content: '>';
}

.active-button {
	background-color: var(--yellow-color);
	color: var(--bg-color);
}

.inactive-button {
	background-color: var(--bg-color);
	color: var(--light-brown-color);
}
</style>