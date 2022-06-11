<template>
	<div class="bold-font fav-button big-font" :class="isActiveButton()">
		{{ text }}
	</div>
</template>

<script>
export default {
  methods: {
    isActiveButton: function() { 
      return this.active ? "active-button" : "inactive-button";
    },
  },
	props: [
		"text",
		"active"
	]
}
</script>

<style>
.fav-button{
	--height: 20px;
	display: inline-block;
	padding: var(--height);
	border-radius: var(--radius);
	margin-right: var(--height);
}

.fav-button:after{
	margin-left: 50px;
	content: '>';
}

.active-button{
	background-color: var(--yellow-color);
	color: var(--bg-color);
}

.inactive-button{
	background-color: var(--bg-color);
	color: var(--light-brown-color);
}
</style>