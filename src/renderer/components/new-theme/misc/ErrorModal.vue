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
		
		<helpGamepad @simulate_a="simulate_a"/>
	</div>
</template>

<script>
import helpGamepad from "@/components/new-theme/misc/helpGamepad.vue";

export default {
	name: "Error",
	components: { helpGamepad },
	props: ["visible", "title", "errors"],
	data: function() {
		return {
		};
	},
	mounted: function() {
		if (this.visible){
			setTimeout(() => {
				this.simulate_a();
			}, 1000 * 60);
		}
	},
	methods: {
		simulate_a() {
			this.$emit("error", {visible:false, title:null, errors:[]})
			this.$emit("home");
		},
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

#error-modal .btn{
	position: absolute;
	bottom: 50px;
	right: 50px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}
#error-modal .btn p{
	display: inline-block;
	line-height: 50px;
}
#error-modal .btn img{
	transform: scale(0.7);
}
</style>