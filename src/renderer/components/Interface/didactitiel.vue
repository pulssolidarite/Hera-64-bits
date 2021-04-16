<template>
  <div class="component">
    <div class="view tutorial">
      <div class="s-title">
        <div class="title">DIDACTITIEL</div>
        <div class="subtitle">
          Les touches par défauts de {{ session.game.name }}. <br />
          Certains jeux permettent de changer les touches
        </div>
      </div>

      <div class="s-content">
        <div class="joystick_d">
          <span class="j_up">{{ session.game.j_up }}</span>
          <span class="j_left">{{ session.game.j_left }}</span>
          <img
            src="@/assets/img/didactitiel/joystick_d.svg"
            alt="joystick illustration"
          />
          <span class="j_right">{{ session.game.j_right }}</span>
          <span class="j_down">{{ session.game.j_down }}</span>
        </div>
        <div class="button_d">
          <div class="t1">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_X.svg"
              alt="touch_X"
            />
            <span class="but_label_X">X</span>
            <span class="txt_btn sp_t1">{{ session.game.btn_x }}</span>
          </div>
          <div class="t2">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_Y.svg"
              alt="touch_Y"
            />
            <span class="but_label_Y">Y</span>
            <span class="txt_btn sp_t2">{{ session.game.btn_y }}</span>
          </div>
          <div class="t3">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_L.svg"
              alt="touch_L"
            />
            <span class="but_label_L">L</span>
            <span class="txt_btn sp_t3">{{ session.game.btn_l }}</span>
          </div>
          <div class="t4">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_A.svg"
              alt="touch_A"
            />
            <span class="but_label_A">A</span>
            <span class="txt_btn sp_t4">{{ session.game.btn_a }}</span>
          </div>
          <div class="t5">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_B.svg"
              alt="touch_B"
            />
            <span class="but_label_B">B</span>
            <span class="txt_btn sp_t5">{{ session.game.btn_b }}</span>
          </div>
          <div class="t6">
            <img
              class="img_btn"
              src="@/assets/img/didactitiel/touch_R.svg"
              alt="touch_R"
            />
            <span class="but_label_R">R</span>
            <span class="txt_btn sp_t6">{{ session.game.btn_r }}</span>
          </div>
        </div>
      </div>

      <helpGamepad :gpio_help="4" :B_but="false" @simulate_a="simulate_a" />
    </div>
  </div>
</template>

<script>
import helpGamepad from "@/components/helpGamepad.vue";

export default {
  name: "Didactitiel",
  props: ["session"],
  data() {
    return {
      pathToKeys: {},
    };
  },
  mounted: function(){
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
  components: { helpGamepad },
  methods: {
    simulate_a() {
      this.$emit("nextView");
    },
  },
};
</script>
