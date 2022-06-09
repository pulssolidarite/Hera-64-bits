<template>
	<div id="favorite" :class="isActive()">
		<div class="transparent-box">
			<p>le jeu du moment</p>
		</div>
		<div class="campaign-name">{{ content.name }}</div>
		<div class="presentation-button">jouer</div>
		<div class="presentation-button">+d'infos</div>
		<img :src="content.logo" />
	</div>
</template>

<script>
export default {
	props: [
		"content", 
		"active",
	],
	methods: {
		isActive(){
			return this.active ? "active" : "inactive";
		}
	},
}
</script>