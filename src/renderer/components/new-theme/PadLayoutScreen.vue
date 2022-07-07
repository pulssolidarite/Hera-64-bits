<template>
	<div id="pad-layout-screen">
	
		<div class="title">
			<div class="very-big-font bold-font game-title">{{ session.game.name }}</div>
			<div class="very-big-font blue">Instructions</div>
		</div>
	
		<div class="pad">
			<div class="joystick">
				<div class="stick">
					<div class="circle">
						<div class="up" :class="session.game.j_up ? 'defined' : 'undefined'">
							<p>{{ session.game.j_up }}</p>
							<div class="arrow"></div>
						</div>
						<div class="left" :class="session.game.j_left ? 'defined' : 'undefined'">
							<p>{{ session.game.j_left }}</p>
							<div class="arrow"></div>
						</div>
						<div class="right" :class="session.game.j_right ? 'defined' : 'undefined'">
							<p>{{ session.game.j_right }}</p>
							<div class="arrow"></div>
						</div>
						<div class="down" :class="session.game.j_down ? 'defined' : 'undefined'">
							<p>{{ session.game.j_down }}</p>
							<div class="arrow"></div>
						</div>
					</div>
				</div>
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
					<div class="txt-btn">{{ session.game.btn_lb }}</div>
					<div class="circle" :class="session.game.btn_lb ? 'defined' : 'undefined'">Lb</div>
				</div>
				<div class="btn btn-rb">
					<div class="txt-btn">{{ session.game.btn_rb }}</div>
					<div class="circle" :class="session.game.btn_rb ? 'defined' : 'undefined'">Rb</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/exports/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/bouton-A-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">jouer</div>
				</div>
			</div>
		</div>

		<!-- <helpGamepad :gpio_help="4" :B_but="false" @simulate_a="simulate_a" /> -->
		<div class="gamepadControls">
			<div v-gamepad:button-b="simulate_a"></div>
		</div>
	</div>
</template>

<script>
// import helpGamepad from "@/components/new-theme/misc/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";

export default {
	components: {
		// helpGamepad,
		AsideBot,
	},
	props: ["session"],
	data() {
		return {
			pathToKeys: {},
		};
	},
	mounted: function() {
		setTimeout(() => {
			this.$emit("home")
		}, 1000 * 60);
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
	.game-title{
		font-size: 80px;
	}

.pad {
	--size: 6.5vw;
}

.buttons {
	position: absolute;
	left: 40%;
	top: 17%;
}

.joystick {
	position: absolute;
	left: 30%;
	top: 50%;
}

.stick {
	height: calc(var(--size) + 1px);
	width: calc(var(--size)/3 + 1px);
	background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
	left: 50%;
	transform: translateX(-50%);
	position: absolute;
}

.stick .circle {
	position: absolute;
	transform: translateX(-50%);
	left: 50%;
	bottom: calc(var(--size) - 15px);
}

.joystick .undefined {
	display: none;
}

.left p,
.right p,
.up p,
.down p {
	height: var(--size);
	width: var(--size);
	text-align: center;
	color: var(--yellow-color);
	font-weight: bold;
	font-size: calc(var(--size)/5);
	position: absolute;
	margin: 0;
}
	.left p{
		transform:translate(calc(-1*var(--size)), -40px);
	}
	.right p{
		transform:translate(calc(var(--size)), -40px);
	}
	.up p{
		transform:translate(0, calc(-1*var(--size) - 40px));
	}
	.down p{
		transform:translate(0, calc(var(--size) + 40px));
	}

.arrow {
	background-image: url('../../assets/img/exports/fleche-simple.svg');
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	height: 50px;
	width: 50px;
	position: absolute;
	top: calc(var(--size)/2 - 25px);
	left: calc(var(--size)/2 - 25px);
}

.left .arrow {
	transform: translateX(calc(-1*var(--size))) rotate(90deg);
}

.right .arrow {
	transform: translateX(var(--size)) rotate(-90deg);
}

.up .arrow {
	transform: translateY(calc(-1*var(--size))) rotate(180deg);
}

.down .arrow {
	transform: translateY(var(--size)) rotate(0deg);
}

.btn {
	position: absolute;
}

.txt-btn {
	color: var(--yellow-color);
	position: absolute;
	left: 50%;
	top: calc(-1*var(--size)/5 - var(--margin));
	transform: translateX(-50%);
	font-weight: bold;
	font-size: calc(var(--size)/5);
}

.circle {
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

.btn .circle {
	border: solid var(--std-opacity) calc(var(--size) / 10);
}

.btn-a .circle,
.btn-b .circle,
.btn-x .circle,
.btn-y .circle {
	color: var(--white-color);
}

.btn-a .circle {
	background: var(--green-color);
}

.btn-b .circle {
	background: red;
}

.btn-x .circle {
	background: var(--blue-color);
}

.btn-y .circle {
	background: var(--yellow-color);
}

.undefined {
	filter: brightness(10%);
}

.instructions{
	left: 90%;
}

/* first column */

.btn-x {
	left: 10vw;
	top: 15vh;
}

.btn-a {
	left: 10vw;
	top: 35vh;
}

.btn-lt {
	left: 10vw;
	top: 55vh;
}

/* second column */

.btn-y {
	left: 22vw;
	top: 10vh;
}

.btn-b {
	left: 22vw;
	top: 30vh;
}

.btn-rt {
	left: 22vw;
	top: 50vh;
}

/* third column */

.btn-lb {
	left: 34vw;
	top: 5vh;
}

.btn-rb {
	left: 34vw;
	top: 25vh;
}
</style>