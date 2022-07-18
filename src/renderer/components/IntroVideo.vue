<template>
	<video autoplay @ended="end">
	<source src="@/assets/intro_arcadeforgood.mp4"
            type="video/mp4">
	</video>
</template>

<script>
export default {
  methods: {
	end: function(){
		this.$emit("nextView");
	}
  },
	
}
</script>