<template>
	<div class="big-card" :class="active ? 'active' : 'inactive'">
		<div class="card-img" :style="image"></div>
		<div class="transparent-box">
			<p class="very-big-font bold-font">{{ content.name }}</p>
		</div>

		<div class="card-desc">
			<p>
				{{ content.description }}
			</p>
		</div>
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";

export default {
	methods: {
		simulate_a() {
			if(this.active){
				// console.log(this.content);
				this.$emit("chose", this.content);
			}
		},
		simulate_b() {},
		simulate_left() {
		},
		simulate_right() {
			},
	},
	components: {
		HelpGamepad,
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
.big-card.active{
	--size: calc(var(--card-h) * 2);
}

.big-card {
	--size: var(--card-h);
	margin: var(--margin);
	height: var(--size);
	width: var(--size);
	border-radius: var(--radius);
	background: white;
}

.card-desc{
	background: var(--std-opacity);
	border-radius: calc(var(--radius));
	margin-top: calc(var(--size) / 2 - var(--border-width));
	margin-left: calc(-1 * var(--border-width));
	height: calc(var(--size) / 2);
	width: calc(var(--size));
}

.card-desc p{
	padding: var(--margin);
}

</style>