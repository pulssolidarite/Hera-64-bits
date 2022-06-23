<template>
	<div id="aside-top">
		<div id="logo">
			<img src="">
		</div>
		<div class="steps">
			<Step num="1" big="jouer" small="une partie"></Step>
			<Step num="2" big="choisir" small="une association"></Step>
			<Step num="3" big="réaliser" small="un don"></Step>
		</div>
	</div>
</template>

<script>
import Step from "@/components/new-theme/misc/Step.vue";
export default {
	components:{
		Step,
	},
}
</script>

<style scoped>
#aside-top {
	background: white;
	height: 100%;
	width: 100%;
	border-radius: 0 0 20px 20px;
	top: 0;
	position: absolute;
}

.steps{
	width: max-content;
	margin: 0 auto;
	margin-top: 100px;
}

</style>