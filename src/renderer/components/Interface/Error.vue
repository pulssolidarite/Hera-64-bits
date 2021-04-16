<template>
  <div id="errorModal" v-if="visible">
    <div
      class="position-absolute h-100 w-100 overlay"
      style="background-color: rgba(0,0,0,.6);"
    ></div>
    <div class="d-flex align-items-center justify-content-center w-100 h-100">
      <div class="modal-dialog modal-confirm">
        <div class="modal-content">
          <div
            class="modal-header d-flex justify-content-center align-items-center"
          >
            <div
              class="icon-box d-flex align-items-center justify-content-center"
            >
              <font-awesome-icon icon="times" style="font-size: 46px;" />
            </div>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-hidden="true"
            >
              &times;
            </button>
          </div>
          <div class="modal-body text-center">
            <h4>{{ title }}</h4>
            <ul class="col-8 offset-2 text-left">
              <li v-for="(error, index) in errors" :key="index">
                {{ error }}
              </li>
            </ul>
            <button class="btn btn-success" data-dismiss="modal">
              <span
                class="g-btn"
                v-gamepad:button-b="simulate_b"
                @click="simulate_b"
                >B</span
              >
              <span>Revenir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: ["visible", "title", "errors"],
  methods: {
    simulate_b() {
      this.$emit("lastView");
    },
  },
  mounted: function(){
    setTimeout(() => this.$emit("home"), 1000 * 60);
  },
};
</script>

<style scoped>
.modal-confirm {
  color: #434e65;
  width: 525px;
}
.modal-confirm .modal-content {
  padding: 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
}
.modal-confirm .modal-header {
  background: #e85e6c;
  border-bottom: none;
  position: relative;
  text-align: center;
  margin: -20px -20px 0;
  border-radius: 5px 5px 0 0;
  padding: 35px;
}
.modal-confirm h4 {
  text-align: center;
  font-size: 36px;
  margin: 10px 0;
}
.modal-confirm .form-control,
.modal-confirm .btn {
  min-height: 40px;
  border-radius: 3px;
}
.modal-confirm .close {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #fff;
  text-shadow: none;
  opacity: 0.5;
}
.modal-confirm .close:hover {
  opacity: 0.8;
}
.modal-confirm .icon-box {
  color: #fff;
  width: 95px;
  height: 95px;
  display: inline-block;
  border-radius: 50%;
  z-index: 9;
  border: 5px solid #fff;
  padding: 15px;
  text-align: center;
}
.modal-confirm .icon-box i {
  font-size: 58px;
  margin: -2px 0 0 -2px;
}
.modal-confirm .btn {
  color: #fff;
  border-radius: 4px;
  background: #eeb711;
  text-decoration: none;
  transition: all 0.4s;
  line-height: normal;
  border-radius: 30px;
  margin-top: 10px;
  padding: 6px 20px;
  min-width: 150px;
  border: none;
}
.modal-confirm .btn:hover,
.modal-confirm .btn:focus {
  background: #eda645;
  outline: none;
}
</style>
