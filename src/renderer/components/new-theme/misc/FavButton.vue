<template>
	<div class="bold-font fav-button big-font" :class="this.active ? 'active-button' : 'inactive-button'">
		
		{{ button.text }}

		<div class="gamepadControls" v-if="active">
			<div v-gamepad:button-b="simulate_a"></div>
		</div>
	</div>
</template>

<script>

export default {
	methods: {
		simulate_a() {
			if (this.active){
				// console.log("btn:",this.button.action);
				this.$emit("selection", this.button.action);
			}
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