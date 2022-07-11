<template>
	<div id="payment-instruction">
		<div id="inline-stepping">
			<div class="line">
				<hr>
			</div>
			<Step class="step active-step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>
	
			<!-- <BigCarrousel	:content="[{name: 'paiement sans contact',
										logo: '../../static/illustration-paiement-sans-contact-325X310.svg',
										description:'Placer un moyen de paiement sans contact sur le terminal.'}]" 
							:selectedElement="null"></BigCarrousel> -->
			<div id="big-carrousel">
				<div class="big-list" ref="list" :style="'transform: translateX('+ listOffset +'px);'">
					<div class="list-wrapper">
						<!-- <BigCard v-for="(card, i) in content" :key="i" :active="i == activeIndex" :content="card" :type="type" @chose="chose">
						</BigCard> -->
							<div class="big-card active">
										<div class="card-img">
											<div class="card-border">
											<img src="@/assets/img/illustration-paiement-sans-contact-325X310.svg" alt="">
											<div class="card-desc transparent-box">
												<p>Placer un moyen de paiement sans contact sur le terminal.</p>
											</div>

											</div>
										</div>
										<div class="title transparent-box  bold-font very-big-font">
											<p>paiement sans contact</p>
										</div>
							</div>
					</div>
				</div>
			</div>
	
		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/bouton-B-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">retour</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<div class="gamepadControls">
			<div v-gamepad:button-x="simulate_b"></div>
		</div>
	</div>
</template>

<script>
import AsideBot from "@/components/misc/aside/AsideBot.vue";
import Step from "@/components/misc/Step.vue";
import BigCarrousel from "@/components/misc/BigCarrousel.vue"

export default {
	data() {
		return {
			stepSize: "80",
			payment: {},
			listOffsetFactor: 0,
			listOffset: 0,
		}
	},
	components: {
		AsideBot,
		Step,
		BigCarrousel,
	},
	name: "Payment",
	props: ["session"],
	mounted: function() {
		this.listOffsetFactor = this.getListOffsetFactor();
		this.listOffset = this.getCenteringOffset() / 2;
		
		if (this.session.terminal.is_free && this.session.amount == 0) {
			setTimeout(() => this.skipPayment(this.session.amount), 1000);
		} else {
			if (this.session.amount) {
				setTimeout(() => this.pay(this.session.amount), 1000);
			} else {
				this.$emit("home");
			}
		}
	},
	methods: {
		simulate_b: function() {
			this.$emit("lastView");
		},
		skipPayment: function(amount) {
			this.payment = {
				donator: this.session.donator.id,
				terminal: this.session.terminal.id,
				campaign: this.session.campaign.id,
				game: this.session.game.id,
				date: new Date(),
				method: "Manual",
				status: "Skiped",
				amount: amount,
				currency: "EUR"
			};

			this.$emit("savePayment", { payment: this.payment });
		},
		skipPaymentError: function(amount) {
			this.payment = {
				donator: this.session.donator.id,
				terminal: this.session.terminal.id,
				campaign: this.session.campaign.id,
				game: this.session.game.id,
				date: new Date(),
				method: "Manual",
				status: "",
				amount: amount,
				currency: "EUR"
			};
			this.$emit("error", {
				visible: true,
				title: "Erreur de connexion",
				errors: [
					"Il y a un problème de connexion au terminal de paiement. Veuillez réessayer ou contacter le support."
				]
			});
		},
		launchPayment: function(amount) {
			try {
				const { execSync } = require("child_process");

				// get terminal IP
				var shellCmd =
					"sudo arp-scan --localnet | grep 'Payter BV' | awk '{print $1}'";
				var TPEip = (execSync(shellCmd).toString() + ":3183").replace(
					/\n|\r|(\n\r)/g,
					""
				);
				// if (TPEip == ""){
				// 	this.$emit("error", {
				// 	visible: true,
				// 	title: "Adresse de TPE introuvable",
				// 	errors: ["Un problème inconnu est survenu. Veuillez réessayer ou contacter le support."]
				// 	});
				// }
				var TPEbin = process.env.HOME + "/Payter/PayterPay.exe";

				//console.log(TPEip)

				// make transaction (amount in cents)
				shellCmd = "mono " + TPEbin + " -u " + TPEip + " -a " + amount * 100;
				// console.log(shellCmd)
				var transaction = execSync(shellCmd)
					.toString()
					.replace(/\n|\r|(\n\r)/g, "");

				// console.log(transaction);

				return transaction;
			} catch (e) {
				this.$emit("error", {
					visible: true,
					title: "Connexion impossible au TPE",
					errors: [
						"Un problème inconnu est survenu. Veuillez réessayer ou contacter le support."
					]
				});
			}
		},
		pay: function(amount) {
			if (this.session.amount != null) {
				// Calling PayterPay script from here
				var result = this.launchPayment(amount);

				this.payment = {
					donator: this.session.donator.id,
					terminal: this.session.terminal.id,
					campaign: this.session.campaign.id,
					game: this.session.game.id,
					date: new Date(),
					method: "Contactless",
					status: "",
					amount: amount,
					currency: "EUR"
				};

				// Checking response from the Payter Pay DLL
				switch (result) {
					case "APPROVED":
						// APPROVED
						this.payment.status = "Accepted";
						this.$emit("savePayment", { payment: this.payment });
						break;
					case "TIMEOUT":
						// TIMEOUT
						this.$emit("error", {
							visible: true,
							title: "Temps écoulé",
							errors: [
								"Vous avez mis trop de temps à passer votre carte. L'opération est annulée, veuillez réessayer."
							]
						});
						break;
					default:
						// UNKNOWN ERROR
						this.$emit("error", {
							visible: true,
							title: "Erreur inconnue",
							errors: [
								"Un problème inconnu est survenu. Veuillez réessayer ou contacter le support."
							]
						});
						break;
				}
			}
		},
		getListOffsetFactor() {
			var cards = document.getElementsByClassName("active");
			if (cards === undefined || cards.length == 0)
				return
			return (parseInt(window.getComputedStyle(cards[0]).width) +
				parseInt(window.getComputedStyle(cards[0]).marginRight) +
				parseInt(window.getComputedStyle(cards[0]).marginLeft));
		},
		getCenteringOffset() {
			return (parseInt(document.body.clientWidth) - this.$refs.list.clientWidth);
		},
	}
};
</script>

<style scoped>
#payment-instruction {
	height: var(--max-h);
}

#payment-instruction #inline-stepping{
	width: 38%;
	justify-content: left;
}
#payment-instruction #inline-stepping hr{
	border-style: dashed;
}

#payment-instruction .transparent-box p {
	color: var(--blue-color);
    -webkit-text-stroke: 0;
}

#payment-instruction .card-desc {
	background: transparent;
}
#payment-instruction .card-desc p {
	font-weight: bold;
	text-align: center;
	color: black;
	padding-left: calc(10 * var(--margin));
	padding-right: calc(10 * var(--margin));
}

#payment-instruction .card-img img{
	height: 100%;
	width: 100%;
	border-radius: 13px;
}

.big-list {
	top: 30%;
	position: absolute;
	height: var(--big-carrousel-h);
}

.list-wrapper {
	height: var(--big-carrousel-h);
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
}



.big-card.active {
	--size: calc(var(--card-h) * 2);
}

.big-card {
	--size: var(--card-h);
	margin: var(--margin);
	height: var(--size);
	width: var(--size);
	border-radius: var(--radius);
	box-shadow: 0 130px 100px -50px black;
	overflow: hidden;
}

.transparent-box,
.title.transparent-box {
	transition-delay: 0s;
	transition: all var(--transition) ease;
}

.card-desc {
	position: absolute;
	bottom: 0;
	background: var(--std-opacity);
	border-radius: calc(var(--radius));
	height: min-content;
	margin: 0;
}

.card-desc p {
	line-height: initial;
	color: var(--light-brown-color);
	padding: 10%;
	padding-top: var(--margin);
}

.big-card.inactive .card-desc.transparent-box {
	transform: translateY(100%);
	width: calc(2 * var(--size));
}

.big-card.active .card-desc.transparent-box {
	transform: translateY(0%);
	width: var(--size);
	transition-delay: var(--transition);
}

.title.transparent-box {
	position: absolute;
	top: 0;
}

.title.transparent-box p {
	padding: var(--margin);
}

.active .title.transparent-box p {
	-webkit-text-stroke: 1px grey;
	color: var(--white-color);
}


</style>
