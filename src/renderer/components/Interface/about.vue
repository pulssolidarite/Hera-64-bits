<template>
  <div class="component">
    <div class="view about">
      <div class="s-title">
        <div class="title">PULS IMPACT</div>
        <div class="subtitle">Agence en innovation solidaire</div>
      </div>

      <div class="about-content">
        <div class="infos-puls">
          <p>
            Puls Impact est une agence qui développe des solutions innovantes de collecte de dons au profit des associations caritatives. 
            Son approche est unique : lier la solidarité et le jeu vidéo. 
            L’objectif est donc de permettre aux citoyens de s’amuser tout en faisant de bonnes actions : <br />
            soutenir des associations par un don ! <br /><br />
            La borne d’arcade solidaire est une des solutions originales développées par Puls Impact. 
            L’intégralité des dons effectuées sur la machine sont reversés à l’association que vous avez sélectionnée. 
            Alors un grand MERCI pour votre engagement ! 
          </p>
        </div>
        <div class="contact">
          <p>
            Nous contacter
            <br /><br />
            Site web : www.puls-impact.fr<br />
            Email : contact@puls-impact.fr<br />
            Téléphone : +33 (0)6 32 46 51 64
          </p>
        </div>
        <div class="QR">
          <img
            src="@/assets/img/QR_PULS.png"
            alt="QR code vers puls-imapct.fr"
          />
        </div>
      </div>
      <helpGamepad :gpio_help="4" :A_but="false" @simulate_b="simulate_b" />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";
export default {
  name: "about",
  components: { helpGamepad },
  mounted : function(){
     setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  methods: {
    simulate_b() {
      this.$emit("lastView");
    },
  },
};
</script>
