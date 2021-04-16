<template>
  <div class="h-100 w-100">
    <h1>Testing GPIO</h1>
  </div>
</template>

<script>
export default {
  name: "Test",
  data: function() {
    return {
      timer: 0
    };
  },
  mounted: function() {
    var path = require("path");
    var absolutePath = path.resolve("src/renderer/assets/cores/genesis_plus_gx_libretro.so");
    console.log(absolutePath);
  },
  methods: {}
};
</script>
