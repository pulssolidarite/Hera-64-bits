<template>
	<div class="small-card" :class="active ? 'active' : 'inactive'">
	
		<div class="card-img" :style="image">
			<div class="card-border"></div>
		</div>
	
		<div class="transparent-box big-font bold-font">
			<p>{{ content.name }}</p>
		</div>
	
		<div class="gamepadControls" v-if="active">
			<div v-gamepad:button-b="simulate_a"></div>
		</div>
	</div>
</template>

<script>

export default {
	methods: {
		simulate_a() {
			if (this.active) {
				// console.log(this.content);
				this.$emit("chose", this.content);
			}
		}
	},
	components: {
	},
	data() {
		return {
			image: "background-image: url('" + this.content.logo + "');" +
				"background-position: center;" +
				"background-size: cover;" +
				"background-repeat: no-repeat;",
		}
	},
	props: [
		"content",
		"active",
	],

}
</script>

<style scoped>
.small-card {
	height: var(--card-h);
	width: var(--card-w);
	border-radius: var(--radius);
	background: white;
	margin-right: var(--margin);
}

.small-card .transparent-box {
	margin-top: -280px;
}
</style>