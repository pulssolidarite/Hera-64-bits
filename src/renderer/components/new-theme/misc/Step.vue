<template>
	<div class="step-desc" :style="'--size: '+getSize()+'px;'">
		<div class="circle">
			<div class="num" :style="'color: '+getColor()+';'">{{ num }}</div>
		</div>
		<div class="text">
			<div class="big blue">{{ big }}</div>
			<div class="small blue">{{ small }}</div>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		getSize: function() {
			if (this.size !== undefined) {
				return this.size;
			} else {
				return this.defaultSize;
			}
		},
		getColor: function() {
			if (this.color !== undefined) {
				return this.color;
			} else {
				return this.defaultColor;
			}
		}
	},
	data() {
		return {
			defaultSize: 60,
			defaultColor: "var(--white-color)",
		}
	},
	props: [
		"num",
		"big",
		"small",
		"color",
		"size",
	],
}
</script>

<style>
.step-desc {
	/* --size: 60px; */
	position: relative;
	font-family: "Silka-Bold";
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
	margin-bottom: 30px;
	padding-left: 80px;
}

.circle {
	height: calc(var(--size));
	width: calc(var(--size));
	border-radius: 50%;
	background: black;
	position: relative;
}

.num {
	background: var(--blue-color);
	color: white;
	margin: 0 auto;
	padding: 0;
	border-radius: 50%;
	width: var(--size);
	height: var(--size);
	line-height: var(--size);
	text-align: center;
	mix-blend-mode: screen;
	font-size: calc(var(--size) - 10px);
	font-weight: bold;
}

.text {
	margin-left: var(--margin);
}

.big,
.small {
	white-space: nowrap;
}

.big {
	top: 0;
	line-height: calc(var(--size) * (2/3));
	font-size: calc(var(--size) * (2/3));
}

.small {
	bottom: 0;
	line-height: calc(var(--size) * (1/3));
	font-size: calc(var(--size) * (1/3));
}
</style>