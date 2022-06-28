<template>
	<div id="pad-layout-screen">
	
		<div class="title">
			<div class="very-big-font">game:{{ session.game.name }}</div>
			<div class="big-font">Instructions</div>
		</div>
	
		<div class="pad">
			<div class="joystick">
				<div class="graphic">
					<div class="circle"></div>
					<div class="stick"></div>
				</div>
				<div class="up">{{ session.game.j_up }}</div>
				<div class="left">{{ session.game.j_left }}</div>
				<div class="right">{{ session.game.j_right }}</div>
				<div class="down">{{ session.game.j_down }}</div>
			</div>
			<div class="buttons">
				<div class="btn btn-x">
					<div class="txt-btn">{{ session.game.btn_x }}</div>
					<div class="circle" :class="session.game.btn_x ? 'defined' : 'undefined'">X</div>
				</div>
				<div class="btn btn-y">
					<div class="txt-btn">{{ session.game.btn_y }}</div>
					<div class="circle" :class="session.game.btn_y ? 'defined' : 'undefined'">Y</div>
				</div>
				<div class="btn btn-a">
					<div class="txt-btn">{{ session.game.btn_a }}</div>
					<div class="circle" :class="session.game.btn_a ? 'defined' : 'undefined'">A</div>
				</div>
				<div class="btn btn-b">
					<div class="txt-btn">{{ session.game.btn_b }}</div>
					<div class="circle" :class="session.game.btn_b ? 'defined' : 'undefined'">B</div>
				</div>
				<div class="btn btn-lt">
					<div class="txt-btn">{{ session.game.btn_l }}</div>
					<div class="circle" :class="session.game.btn_l ? 'defined' : 'undefined'">Lt</div>
				</div>
				<div class="btn btn-rt">
					<div class="txt-btn">{{ session.game.btn_r }}</div>
					<div class="circle" :class="session.game.btn_r ? 'defined' : 'undefined'">Rt</div>
				</div>
				<!-- Lb and Rb need to be defined in Seth API -->
				<div class="btn btn-lb">
					<div class="txt-btn">{{ session.game.btn_l }}</div>
					<div class="circle" :class="session.game.btn_lb ? 'defined' : 'undefined'">Lb</div>
				</div>
				<div class="btn btn-rb">
					<div class="txt-btn">{{ session.game.btn_r }}</div>
					<div class="circle" :class="session.game.btn_lr ? 'defined' : 'undefined'">Rb</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/exports/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<helpGamepad :gpio_help="4" :B_but="false" @simulate_a="simulate_a" />
	</div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";

export default {
	components:{
		helpGamepad,
		AsideBot,
	},
	props: ["session"],
	data() {
		return {
			pathToKeys: {},
		};
	},
	mounted: function() {
		setTimeout(() => this.$emit("home"), 1000 * 60);
	},
	methods: {
		simulate_a() {
			this.$emit("nextView");
		},
	},
};
</script>

<style scoped>
#pad-layout-screen {
	height: var(--max-h);
}

.title {
	color: var(--white-color);
	position: absolute;
	left: calc(var(--aside-w) + var(--margin));
	top: 50px;
}

.pad{
	--size: 6.5vw;
}

.buttons{
	position: absolute;
	left: 40%;
	top: 17%;
}

.joystick{
	position: absolute;
	left: 30%;
	top: 40%;
}

.btn{
	position: absolute;
}

.txt-btn{
	color: var(--yellow-color);
	position: absolute;
	left: 50%;
	top: calc(-1*var(--size)/5 - var(--margin));
	transform: translateX(-50%);
	font-weight: bold;
	font-size: calc(var(--size)/5);
}

.circle{
	background: var(--light-grey-color);
	width: var(--size);
	height: var(--size);
	border-radius: var(--size);
	line-height: var(--size);
	color: var(--bg-color);
	text-align: center;
	font-weight: bold;
	font-size: calc(var(--size) / 3);
	text-transform: none;
}
	.btn .circle{
		border: solid var(--std-opacity) calc(var(--size) / 10);
	}
	.btn-a .circle, .btn-b .circle, .btn-x .circle, .btn-y .circle{
		color: var(--white-color);
	}
	.btn-a .circle{
		background: var(--green-color);
	}
	.btn-b .circle{
		background: red;
	}
	.btn-x .circle{
		background: var(--blue-color);
	}
	.btn-y .circle{
		background: var(--yellow-color);
	}

	.undefined{
		filter: var(--grayscale);
	}

.stick{
	height: calc(var(--size) + 1px);
	width: calc(var(--size)/5 + 1px);
	background: rgb(255,255,255);
	background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
	margin: 0 auto;
	margin-top: -30px;
}

/* first column */
.btn-x{
	left: 10vw;
	top: 15vh;
}
.btn-a{
	left: 10vw;
	top: 35vh;
}
.btn-lt{
	left: 10vw;
	top: 55vh;
}

/* second column */
.btn-y{
	left: 22vw;
	top: 10vh;
}
.btn-b{
	left: 22vw;
	top: 30vh;
}
.btn-rt{
	left: 22vw;
	top: 50vh;
}

/* third column */
.btn-lb{
	left: 34vw;
	top: 5vh;
}
.btn-rb{
	left: 34vw;
	top: 25vh;
}
</style>