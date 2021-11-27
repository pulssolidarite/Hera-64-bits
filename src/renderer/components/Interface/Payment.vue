<template>
  <div class="component">
    <div class="view payment">
      <div class="s-title">
        <div class="title">
          <img class="padlock-icon" src="@/assets/img/padlock.svg" alt="padlock" />
          Realise ton don !
          <img
            class="padlock-icon"
            src="@/assets/img/padlock.svg"
            alt="padlock"
          />
          <div id="time">
            <div class="time">{{ session.terminal.play_timer }} min. de jeu</div>
          </div>
        </div>
        <div class="subtitle">
          <div class="animHorizontalText" style="margin-bottom:-50px">
            Place ton moyen de paiement sans contact sur le terminal de la
            borne.
          </div>
          <!-- <br />
          Tu pourras récupérer un reçu après ta partie.-->
        </div>
      </div>

      <div class="s-content">
        <img class="nfc-illustration" src="@/assets/img/payement.svg" />

        <div class="recap">
          <div class="game-icon">
            <img class="logo-circle" :src="session.game.logo" :alt="session.game.name" />
          </div>
          <span class="txt-recap">
            Je reverse
            <span style="color:#C97005;">{{ session.amount }} €</span> à
            l’association
            <span style="color:#C97005;">{{ session.campaign.name }}</span> en
            jouant à
            <span style="color:#C97005;">{{ session.game.name }}</span>
          </span>
          <div class="asso-icon">
            <img class="logo-circle" :src="session.campaign.logo" :alt="session.campaign.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Payment",
  props: ["session"],
  mounted: function() {
    if (this.session.terminal.is_free && this.session.amount == 0) {
      setTimeout(() => this.skipPayment(this.session.amount), 1000);
    } else {
      if (this.session.amount) {
        setTimeout(() => this.pay(this.session.amount), 1000);
      } else {
        this.$emit("lastView");
      }
    }
  },
  methods: {
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

<style scoped>
.nfc-illustration {
  height: 70%;
  margin-top: 50vh;
  margin-left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.recap {
  position: relative;
  margin-left: 50%;
  margin-top: -18vh;
  transform: translateX(-50%);
  background-color: #512fb5;
  box-shadow: -5px 0px #775ce4, 0px -5px #775ce4, 5px 0px #372491,
    0px 5px #372491;
  text-align: center;
  width: 50vw;
  height: 10vh;
  z-index: 4;
}

.txt-recap {
  font-family: pixel3;
  color: white;
  font-size: 1.2rem;
  position: absolute;
  left: 50%;
  width: 36vw;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.game-icon {
  position: absolute;
  left: 100%;
  transform: translateX(-100%) scale(0.8);
}
.asso-icon {
  position: absolute;
  left: 0%;
  transform: scale(0.8);
}
</style>
