<template>
	<div v-if="content && content.logo && content.name" class="big-card" :class="active ? 'active' : 'inactive'">
		
		


		<div class="card-img" :style="image">
			<div class="card-desc transparent-box">
				<p>
					{{ content.description }}
				</p>
			</div>
			<div class="card-border"></div>
		</div>


		<div class="title transparent-box  bold-font" :class="active ? 'very-big-font' : 'big-font'">
			<p>{{ content.name }}</p>
		</div>

		
		<!-- GAMEPAD -->
		<helpGamepad v-if="active" :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";

export default {
  created () {
	if (this.content !== undefined)
		this.image = "background-image: url('" + this.content.logo + "');" +
				"background-position: center;" +
				"background-size: cover;" +
				"background-repeat: no-repeat;";
  },
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
			image: "",
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
	box-shadow: 0 130px 100px -50px black;
}

.transparent-box,
.title.transparent-box{
	transition-delay: 0s;
	transition: all var(--transition) ease;
}

.card-desc{
	position: absolute;
	bottom: 0;
	background: var(--std-opacity);
	border-radius: calc(var(--radius));
	height: min-content;
	margin: 0;
}

	.card-desc p{
		line-height: initial;
		color: var(--light-brown-color);
		padding: 10%;
		padding-top: var(--margin);
	}

.big-card.inactive .card-img{
	filter: var(--grayscale);
}

.big-card.inactive .card-desc.transparent-box {
	transform: translateY(100%);
	width: calc(2 * var(--size));
	/* transition-delay: var(--transition); */
}

.big-card.active .card-desc.transparent-box {
	transform: translateY(0%);
	width: var(--size);
	transition-delay: var(--transition);
}

.title.transparent-box{
	position: absolute;
	top: calc((var(--size)/2));
	/* transition-delay: var(--transition); */
}

.title.transparent-box p{
	padding: var(--margin);
	/* transition: all var(--transition) ease; */
}

.active .title.transparent-box{
	position: absolute;
	top: calc((var(--size) * -.01));
}

.active .title.transparent-box p{
	-webkit-text-stroke: 1px grey;
	color: var(--white-color);
}
</style>