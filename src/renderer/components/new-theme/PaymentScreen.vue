<template>
	<div id="payment-screen">
	
		<!-- steps -->
		<div id="inline-stepping">
			<Step class="step" num="1" big="jouer" small="une partie" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step" num="2" big="choisir" small="une association" color="var(--bg-color)" :size="stepSize"></Step>
			<div class="line">
				<hr>
			</div>
			<Step class="step active-step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>
	

		<!-- title -->
		<div class="infos">
			<div v-if="!session.terminal.is_free" class="title very-big-font bold-font">votre don pour :</div>
			<div v-if="!session.terminal.is_free" class="subtitle very-big-font bold-font">
				<div>{{ session.campaign.campaign.name }}</div>
			</div>
			<div class="freeModeMessage very-big-font bold-font" v-if="session.terminal.is_free">
				Si tu sélectionnes 0€, c'est ton entreprise qui s'engage à faire un don à ta place
			</div>
		</div>
	
		<!-- payment-tool -->
		<div id="payment-tool">
			<div id="arrows">
				<img id="up-arrow" class="arrow" src="@/assets/img/exports/fleche-haut-80x80px.svg" />
				<div class="invisible-box"></div>
				<img id="down-arrow" class="arrow" src="@/assets/img/exports/fleche-bas-80x80px.svg" />
			</div>
			<div class="boxes">
				<div class="box-wrapper">
					<div class="number-box active">{{ amount[0].n }}</div>
					<div class="number-box">{{ amount[1].n }}</div>
					<div class="euro number-box">
						<div id="maxlimit" v-if="eurobox == 'maxlimit'">
							Max.
							<br /> {{ max_amount }}€
						</div>
						<div id="minlimit" v-if="eurobox == 'minlimit'">
							Min.
							<br /> {{ min_amount }}€
						</div>
						<div id="default" v-if="eurobox == 'default'">€</div>
						<div id="start" v-if="eurobox == 'start'">Start</div>
					</div>
				</div>
			</div>
		</div>

		<!-- campaing -->
		<DonationInfos :campaign="session.campaign"></DonationInfos>

		<!-- aside -->
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/exports/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="3" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" @simulate_up="simulate_up" @simulate_down="simulate_down" />
	</div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";
import AnimatedNumber from "animated-number-vue";
import Step from "@/components/new-theme/misc/Step.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import DonationInfos from "@/components/new-theme/misc/DonationInfos.vue";
export default {
	name: "AmountChoice",
	components: {
		helpGamepad,
		AnimatedNumber,
		Step,
		AsideBot,
		DonationInfos,
	},
	props: ["session"],
	data: function() {
		return {
			active_box: 1,
			boxes: "",
			arrows: "",
			amount: [
				{ n: 0, limit: 5 },
				{ n: 1, limit: 9 },
			],
			max_amount: 50,
			min_amount: 1,
			eurobox: "default",
			stepSize: "80",
		};
	},
	mounted: function() {
		if (!this.session.position_asso) {
			this.$emit("lastView");
		}

		this.defineFreeMode();

		this.boxes = document.getElementsByClassName("number-box");
		this.arrows = document.getElementById("arrows");

		this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
		setTimeout(() => this.$emit("home"), 1000 * 60);
	},
	methods: {
		defineFreeMode: function() {
			if (this.session.terminal.is_free) {
				this.min_amount = 0;
				this.amount[1].n = 0;
			}
		},
		countAmount() {
			// return in cents : 1€ = 100
			var count = 0;
			var e = 1;
			this.amount.forEach((a) => {
				count += a.n * 10 ** e;
				e--;
			});

			return count;
		},
		updateEurobox() {
			var count = this.countAmount();

			this.eurobox = "default";
			document.getElementsByClassName("euro")[0].style.background = "var(--blue-color)";

			if (count < this.min_amount) {
				this.eurobox = "minlimit";
				document.getElementsByClassName("euro")[0].style.background = "red";
			} else if (count > this.max_amount) {
				this.eurobox = "maxlimit";
				document.getElementsByClassName("euro")[0].style.background = "red";
			}
		},
		nextBox(direction = 1) {
			// direction = 1 or -1

			if (
				(direction != 1 && direction != -1) ||
				(this.active_box <= 0 && direction == -1) ||
				(this.active_box >= this.boxes.length - 1 && direction == 1)
			)
				return;

			this.active_box += direction;
			this.boxes[this.active_box].classList.toggle("active");
			this.boxes[this.active_box - direction].classList.toggle("active");
			this.moveArrows(direction);
		},
		moveArrows() {
			if (this.active_box < this.boxes.length - 1) {
				this.arrows.style.left = this.boxes[this.active_box].offsetLeft + "px";
			}
			if (this.eurobox == "default" && this.active_box == this.boxes.length - 1) {
				this.eurobox = "start";
				this.arrows.style.display = "none";
				this.boxes[this.boxes.length - 1].classList.toggle("start");
				this.boxes[this.boxes.length - 1].classList.toggle("default");
				document.getElementsByClassName("euro")[0].style.background = "#99c961";
			} else if (this.eurobox == "start" && this.active_box < this.boxes.length) {
				this.eurobox = "default";
				this.arrows.style.display = "block";
				this.boxes[this.boxes.length - 1].classList.toggle("start");
				this.boxes[this.boxes.length - 1].classList.toggle("default");
				document.getElementsByClassName("euro")[0].style.background = "var(--blue-color)";
			}
		},
		incrementNum(incr = 1) {
			// incr is direction 1 or -1
			if ((incr != 1 && incr != -1) || this.active_box >= this.boxes.length - 1) return;
			if (this.amount[this.active_box].n == 0 && incr == -1)
				this.amount[this.active_box].n = this.amount[this.active_box].limit;
			else
				this.amount[this.active_box].n =
				(this.amount[this.active_box].n + incr) %
				(this.amount[this.active_box].limit + 1);

			this.updateEurobox();
		},
		simulate_a() {
			if (this.active_box < this.boxes.length - 1) {
				this.nextBox(1);
			} else if (this.active_box == this.boxes.length - 1 && this.eurobox == "start") {
				this.$emit("saveAmount", {
					amount: this.countAmount(),
				});
				this.$emit("nextView");
			}
		},
		simulate_b() {
			if (this.active_box == 0) {
				this.$emit("lastView");
			} else if (this.active_box < this.boxes.length) {
				this.nextBox(-1);
			}
		},
		simulate_left() {
			this.nextBox(-1);
		},
		simulate_right() {
			this.nextBox(1);
		},
		simulate_up: function() {
			this.incrementNum(1);
		},
		simulate_down: function() {
			this.incrementNum(-1);
		},
	},
};
</script>

<style scoped>
#payment-screen {
	height: var(--max-h);
}

.infos{
	position: absolute;
	top: 25%;
	left: 85px;
}

.title{
	color: var(--blue-color);
}

.subtitle{
	color: var(--white-color);
}

.freeModeMessage {
	color: var(--blue-color);
	width : 400px;
}

#start {
	font-size: 5vh;
}

#maxlimit,
#minlimit {
	font-size: 5vh;
	line-height: calc(15vh / 2);
}

#payment-tool {
	background: var(--blue-color);
	position: absolute;
	top: 25%;
	left: 50%;
	transform: translateX(-50%);
	border-radius: var(--radius);
}

#arrows {
	position: absolute;
	transition-duration: 0.3s;
	top: 50%;
	transform: translateY(-50%);
}


#up-arrow {
	animation: topArrow 1s ease-in-out infinite;
}

#down-arrow {
	animation: botArrow 1s ease-in-out infinite;
}

.arrow {
	display: block;
	margin-left: calc((15vh / 2) - 40px);
}

.invisible-box {
	margin: 5px;
	height: 13vh;
	width: calc(15vh + 20px);
	justify-content: center;
}

.boxes {
	display: flex;
	justify-content: center;
}

.box-wrapper {
	width: min-content;
	display: flex;
	justify-content: center;
}

.number-box,
.euro{
	transition-duration: 0.1s;
	margin: 15px;
	height: 15vh;
	width: 15vh;
	line-height: 15vh;
	text-align: center;
}

.number-box,
.euro {
	background-color: white;
	font-size: 9rem;
	color: var(--bg-color);
	border-radius: var(--radius);
}

.euro.number-box{
	background-color: var(--blue-color);
	color: var(--white-color);
}

@keyframes overflowVerticalText {
	20% {
		transform: translateY(0%);
	}
	98% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0%);
	}
}

.animVerticalText {
	animation: overflowVerticalText 10s linear infinite;
}

@keyframes topArrow {
	50% {
		transform: translateY(-10px);
	}
}

@keyframes botArrow {
	50% {
		transform: translateY(10px);
	}
}


</style>
