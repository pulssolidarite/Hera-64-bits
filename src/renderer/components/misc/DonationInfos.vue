<template>
	<div id="donation-infos" v-if="campaign">
		<div class="brown inline-txt-img center-items">
			<div class="inline-img"><img class="inline-img" src="@/assets/img/picto-assoretenue-80x80px.svg"></div>
			<div class="inline-txt">
				<div class="big-font bold-font">association retenue</div>
			</div>
		</div>
	
		<div class="asso-logo"><img :src="campaign.logo"></div>

		<div class="asso-steps">
			<div class="asso-step" v-for="(step, i) in campaign.donationSteps" :key="i" :style="'width: calc((100% / '+campaign.donationSteps.length+'));'">
				<div class="asso-line" v-if="i < campaign.donationSteps.length - 1" :style="'width: calc((100% / '+campaign.donationSteps.length+'));'"></div>
				<div class="step-circle">
					<div class="step-amount bold-font">{{ step.amount }}</div>
				</div>
				<div class="asso-txt bold-font small-font">{{ step.text }}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: [
		"campaign",
	],

}
</script>

<style scoped>
#donation-infos {
	--size: 60px;
	position: absolute;
	height: 450px;
	width: calc(50% + (45vh + 90px)/2 - 15px);
	bottom: calc(2 * var(--margin));
	right: var(--margin);
	background: var(--light-grey-color);
	border-radius: var(--radius);
}

.asso-logo{
	position: absolute;
	right: var(--margin);
	top: var(--margin);
	width: 200px;
	height: 100px;
	border-radius: var(--radius);
}

.asso-steps{
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-evenly;
	padding: 10px;
	margin-top: 30px;
}

.step-circle{
	position: absolute;
	border: 10px solid var(--light-grey-color);
	background: var(--blue-color);
	border-radius: 50%;
	height: var(--size);
	width: var(--size);
}

.step-amount{
	color: var(--white-color);
	line-height: var(--size);
	text-align: center;
	font-size: calc(var(--size) / 2);
}
	.step-amount::after{
		content: '€';
	}

.asso-line {
	position: absolute;
	height: 6px;
	background: var(--blue-color);
	transform: translate(var(--size), calc((8px + var(--size)/2)));
}

.asso-txt{
	margin-top: 80px;
	padding: 10px;
}

.inline-txt-img {
	--std-height: 70px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	position: relative;
	width: 70%;
	height: var(--std-height);
	margin: var(--margin);
	margin-top: 30px;
}

.inline-img img {
	margin: 0 calc(2 * var(--margin)) 0 0;
	height: var(--std-height);
	width: var(--std-height);
}

.inline-txt {
	line-height: var(--std-height);
	height: var(--std-height);
	width: 100%;
}

.over,
.under {
	line-height: calc(var(--std-height) / 2);
}

.center-items {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}

.block-txt-img {
	text-align: center;
}

.block-txt-img img {
	margin: 0 var(--margin) 0 var(--margin);
	height: var(--std-height);
	width: var(--std-height);
}
</style>