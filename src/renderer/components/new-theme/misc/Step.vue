<template>
	<div class="step-desc">
		<div class="circle">
			<div class="num">{{ num }}</div>
		</div>
		<div class="big">{{ big }}</div>
		<div class="small">{{ small }}</div>
	</div>
</template>

<script>
export default {
	props: [
		"num",
		"big",
		"small",
	],
}
</script>

<style>
.step-desc {
	color: #44c1e4;
	position: relative;
	margin-bottom: 30px;
	/* background: red; */
}

.circle {
	height: 50px;
	width: 50px;
	border-radius: 50%;
	background-color: black;
	position: relative;
}

.num {
	background-color: #44c1e4;
	color: white;
	margin: 0 auto;
	padding: 0;
	border-radius: 50%;
	width: 52px;
	height: 52px;
	line-height: 52px;
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	mix-blend-mode: screen;
	font-size: 2em;
	font-weight: bold;
}

.big, .small{
	position: absolute;
	left: 60px;
}

.big{
	top: 0;
	line-height: 30px;
	font-size: 1.5em;
}

.small{
	bottom: 0;
	line-height: 20px;
}
</style>