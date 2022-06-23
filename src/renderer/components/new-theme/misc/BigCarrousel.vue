<template>
	<div id="big-carrousel">
		<div class="big-list" ref="list" :style="'transform: translateX('+ listOffset +'px);'">
			<div v-if="content" class="list-wrapper">
				<BigCard v-for="(card, i) in content" :key="i" :active="i == activeIndex" :content="card" @chose="chose">
				</BigCard>
			</div>
		</div>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
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
		this.listOffset = this.getCenteringOffset();
	},
	components: {
		HelpGamepad,
		BigCard,
	},
	props: [
		"content",
		"selectedElement",
	],
	methods: {
		chose: function(data) {
			this.$emit("chose", data)
		},
		simulate_a() {},
		simulate_b() {},
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
			return (parseInt(document.body.clientWidth) - this.$refs.list.clientWidth) / 2;
		},
		moveSelection(direction) { // direction must be -1 or +1 for left or right
			if (direction != 1 && direction != -1)
				return;

			var limit = (direction == 1 ? this.content.length : -1);
			if (this.activeIndex + direction == limit) {
				return;
			} else {
				this.activeIndex += direction;
				if (this.content.length % 2)
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

</style>