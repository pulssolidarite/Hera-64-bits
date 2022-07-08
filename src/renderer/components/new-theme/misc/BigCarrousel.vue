<template>
	<div id="big-carrousel">
		<div class="big-list" ref="list" :style="'transform: translateX('+ listOffset +'px);'">
			<div v-if="content" class="list-wrapper">
				<BigCard v-for="(card, i) in content" :key="i" :active="i == activeIndex" :content="card" :type="type" @chose="chose">
				</BigCard>
			</div>
		</div>
		<div v-if="content.length > 1">
			<div class="arrow-left"><img src="src/renderer/assets/img/exports/fleche-gauche-80X80px.svg"></div>
			<div class="arrow-right"><img src="src/renderer/assets/img/exports/fleche-droite-80x80px.svg"></div>
		</div>

		<div class="gamepadControls">
			<span v-gamepad:left-analog-left="simulate_left"></span>
			<span v-gamepad:left-analog-right="simulate_right"></span>
			<div v-gamepad:button-a="simulate_x"></div>
		</div>
	</div>
</template>

<script>
import BigCard from "@/components/new-theme/misc/BigCard.vue";

export default {
	created() {
		this.activeIndex = this.getActiveIndex();
		this.getReorderedContent();
	},
	data() {
		return {
			activeIndex: 0,
			listOffsetFactor: 0,
			listOffset: 0,
		}
	},
	mounted: function() {
		this.listOffsetFactor = this.getListOffsetFactor();
		if (this.content.length % 2) {
			this.listOffset = this.getCenteringOffset() / 2;
		} else {
			this.listOffset = (this.getCenteringOffset() - this.listOffsetFactor) / 2;
		}
	},
	components: {
		BigCard,
	},
	props: [
		"content",
		"selectedElement",
		"type",
	],
	methods: {
		chose: function(data) {
			this.$emit("chose", data)
		},
		simulate_x() {
			var randomElement;
			var randomIndex;
			const toIndex = this.activeIndex;
			do {
				randomElement = this.content[Math.floor(Math.random()*this.content.length)];
				randomIndex = this.content.indexOf(randomElement);
			} while (toIndex == randomIndex);

			const diff = toIndex - randomIndex;
			for (let i = 0; i < Math.abs(diff); i++) {
				if (diff > 0){
					this.moveSelection(-1);
				}
				if (diff < 0){
					this.moveSelection(1);
				}
			}
		},
		simulate_left() {
			this.moveSelection(-1);
		},
		simulate_right() {
			this.moveSelection(1);
		},
		getReorderedContent: function() {
			if (this.selectedElement === undefined || this.content === undefined || !this.content.length)
				return;

			for (let i = 0; i < this.content.length; i++) {
				if (this.content[i] == this.selectedElement) {
					this.content = this.swapArrayElements(this.content, i, this.activeIndex)
					return;
				}
			}
		},
		swapArrayElements: function(arr, x, y) {
			if (arr.length <= 1 || x == y) return arr;
			arr.splice(y, 1, arr.splice(x, 1, arr[y])[0]);
			return arr;
		},
		getActiveIndex: function() {
			return Math.floor(this.content.length / 2);
		},
		getListOffsetFactor() {
			var cards = document.getElementsByClassName("inactive");
			if (cards === undefined || cards.length == 0)
				return
			return (parseInt(window.getComputedStyle(cards[0]).width) +
				parseInt(window.getComputedStyle(cards[0]).marginRight) +
				parseInt(window.getComputedStyle(cards[0]).marginLeft));
		},
		getCenteringOffset() {
			return (parseInt(document.body.clientWidth) - this.$refs.list.clientWidth);
		},
		moveSelection(direction) { // direction must be -1 or +1 for left or right
			if (direction != 1 && direction != -1)
				return;

			var limit = (direction == 1 ? this.content.length : -1);
			if (this.activeIndex + direction == limit) {
				return;
			} else {
				this.activeIndex += direction;
				this.listOffset += this.listOffsetFactor * -direction;
			}
		},
	},
}
</script>

<style scoped>
.active,
.inactive,
.big-list {
	transition-duration: var(--transition);
}

.big-list {
	top: 30%;
	position: absolute;
	height: var(--big-carrousel-h);
}

.list-wrapper {
	height: var(--big-carrousel-h);
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
}

.arrow-left,
.arrow-right{
	position: absolute;
	top: 48%;
	margin: 0;
}

.arrow-left{
	left: 150px;
	animation: leftArrow 1s ease-in-out infinite;
}

.arrow-right{
	right: 150px;
	animation: rightArrow 1s ease-in-out infinite;
}

@keyframes leftArrow {
	50% {
		transform: translateX(-10px);
	}
}

@keyframes rightArrow {
	50% {
		transform: translateX(10px);
	}
}
</style>