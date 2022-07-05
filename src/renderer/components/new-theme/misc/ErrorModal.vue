<template>
	<div id="error-modal" v-if="visible">
		<div id="infos" class="inline-txt-img center-items">
			<div class="inline-img"><img src="@/assets/img/exports/picto-fail-325X260.svg"></div>
			<div class="inline-txt bold-font">
				<div class="over very-big-font">{{ title }}</div>
				<div class="under big-font">{{ errors[0] }}</div>
			</div>
		</div>

		<div class="btn"><p class="big-font">sortir</p><img src="@/assets/img/exports/fleche-noire.svg"><img src="@/assets/img/exports/bouton-A-noir.svg"></div>
		
		<helpGamepad :gpio_help="2" v-gamepad:button-a="simulate_a" v-gamepad:button-b="simulate_b" v-gamepad:button-dpad-up="simulate_up" v-gamepad:button-dpad-down="simulate_down" v-gamepad:left-analog-down="simulate_down" v-gamepad:left-analog-up="simulate_up"
			v-gamepad:right-analog-down="simulate_down" v-gamepad:right-analog-up="simulate_up" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	</div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
	name: "Error",
	components: { helpGamepad },
	props: ["visible", "title", "errors"],
	data: function() {
		return {
		};
	},
	mounted: function() {
		setTimeout(() => this.$emit("home"), 1000 * 60);
	},
	methods: {
		simulate_up() {
		},
		simulate_down() {
		},
		simulate_a() {
			this.$emit("error", {visible:false, title:null, errors:[]})
			this.$emit("lastView");
		},
		simulate_b() {},
	},
};
</script>

<style>
#error-modal {
	background: var(--yellow-color);
	color: var(--bg-color);
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	height: 50%;
	width: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
}
#error-modal .inline-txt-img{
	width: 60%;
	margin: 0 auto;
}
#error-modal .inline-txt{
	position: absolute;
	top: 20%;
	left: 350px;
	transform: translateY(-50%);
}

#error-modal .over{
	line-height: 200px;
}

.btn{
	position: absolute;
	bottom: 50px;
	right: 50px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}
.btn p{
	display: inline-block;
	line-height: 50px;
}
.btn img{
	transform: scale(0.7);
}
</style>