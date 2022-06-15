<template>
	<div class="bold-font fav-button big-font" :class="isActiveButton()">
		{{ text }}
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	
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
				this.$emit("selection");
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
		"text",
		"active"
	]
}
</script>

<style>
.active-button,
.inactive-button{
	transition: all var(--transition) ease;
}
.fav-button {
	--height: 20px;
	display: inline-block;
	padding: var(--height);
	border-radius: var(--radius);
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