<template>
	<div id="payment-instruction">
		<div id="inline-stepping">
			<div class="line">
				<hr>
			</div>
			<Step class="step active-step" num="3" big="réaliser" small="un don" color="var(--bg-color)" :size="stepSize"></Step>
		</div>
	
		<div>
			<BigCarrousel	:content="[{name: 'paiement sans contact',
										logo: 'http://localhost:9080/src/renderer/assets/img/exports/illustration-paiement-sans-contact-325X310.svg',
										description:'Placer un moyen de paiement sans contact sur le terminal.'}]" 
							:selectedElement="null"></BigCarrousel>
		</div>
	
		<div class="instructions">
			<div class="inline-txt-img center-items">
				<div class="inline-img"><img src="@/assets/img/exports/bouton-B-80x80px.svg"></div>
				<div class="inline-txt">
					<div class="txt brown bold-font">retour</div>
				</div>
			</div>
		</div>
	
		<div id="aside">
			<div id="logo">
				<img src="@/assets/img/exports/logo-arcadeforgood-fondnoir-130X152.svg">
			</div>
			<AsideBot></AsideBot>
		</div>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_right="simulate_right" @simulate_left="simulate_left" />
	
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import AsideBot from "@/components/new-theme/misc/aside/AsideBot.vue";
import Step from "@/components/new-theme/misc/Step.vue";
import BigCarrousel from "@/components/new-theme/misc/BigCarrousel.vue"

export default {
	data() {
		return {
			stepSize: "80",
			payment: {},
		}
	},
	components: {
		HelpGamepad,
		AsideBot,
		Step,
		BigCarrousel,
	},
	name: "Payment",
	props: ["session"],
	mounted: function() {
		if (this.session.terminal.is_free && this.session.amount == 0) {
			setTimeout(() => this.skipPayment(this.session.amount), 1000);
		} else {
			if (this.session.amount) {
				setTimeout(() => this.pay(this.session.amount), 1000);
			} else {
				// this.$emit("lastView");
			}
		}
	},
	methods: {
		simulate_a: function() {},
		simulate_b: function() {
			this.$emit("lastView");
		},
		simulate_left: function() {},
		simulate_right: function() {},
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
				var TPEbin = process.env.HOME + "/Payter/PayterPay.exe";

				//console.log(TPEip)

				// make transaction (amount in cents)
				shellCmd = "mono " + TPEbin + " -u " + TPEip + " -a " + amount * 100;
				//console.log(shellCmd)
				var transaction = execSync(shellCmd)
					.toString()
					.replace(/\n|\r|(\n\r)/g, "");

				//console.log(transaction);

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
		}
	}
};
</script>

<style>
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

</style>
