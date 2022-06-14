<template>
	<div class="small-card" :class="active ? 'active' : 'inactive'" :style="image">
				<div class="transparent-box">
					<p>{{ content.name }}</p>
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

<style>
.small-card {
	flex-shrink: 0;
}
</style>