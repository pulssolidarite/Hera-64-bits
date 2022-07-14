<template>
	<div id="small-carrousel">
		<div class="list-title bold-font big-font">{{ title }}</div>
		<div class="small-list" ref="list">
			<SmallCard :active="isActiveCard(i)" v-for="(card, i) in content" :key="i" :content="card" @chose="chose">
			</SmallCard>
		</div>
	
		<div class="carrousel-arrow" v-if="content.length > 4">
			<img ref="arrow" src="@/assets/img/fleche-droite-80x80px.svg">
		</div>
	
		<div class="gamepadControls" v-if="active">
			<span v-gamepad:left-analog-left="simulate_left"></span>
			<span v-gamepad:left-analog-right="simulate_right"></span>
		</div>
	</div>
</template>

<script>
import SmallCard from "@/components/misc/SmallCard.vue";

export default {
	data() {
		return {
			activeIndex: 0,
			listOffsetFactor: 0,
			listOffset: 0,
		}
	},
	mounted: function() {
		this.listOffsetFactor = this.getListOffsetFactor();
	},
	components: {
		SmallCard,
	},
	props: [
		"content",
		"active",
		"title",
	],
	methods: {
		chose(data) {
			// console.log("chose: ", data.name);
			if (this.active)
				this.$emit("carrouselChose", data)
		},
		isActiveCard: function(i) {
			return (i == this.activeIndex && this.active ? true : false);
		},
		simulate_left() {
			this.moveSelection(-1);
		},
		simulate_right() {
			this.moveSelection(1);
		},
		getListOffsetFactor() {
			var cards = document.getElementsByClassName("small-card");
			if (cards === undefined || cards.length == 0)
				return
			return parseInt(window.getComputedStyle(cards[0]).width) + parseInt(window.getComputedStyle(cards[0]).marginRight);
		},
		moveSelection(direction) { // direction must be -1 or +1 for left or right
			if (direction != 1 && direction != -1 || !this.active)
				return;

			var limit = (direction == 1 ? this.content.length : -1);
			if (this.activeIndex + direction == limit) {
				return;
			} else {
				this.activeIndex += direction;
				if (this.activeIndex >= 4) { // slide game list (left/right) when selected card index is >=4
					this.listOffset += this.listOffsetFactor * -direction;
					if (this.$refs.arrow) {
						this.$refs.arrow.style.transform = "rotate(180deg)"
					}
				} else {
					this.listOffset = 0;
					if (this.$refs.arrow) {
						this.$refs.arrow.style.transform = "rotate(0deg)"
					}
				}
				this.$refs.list.style.transform = "translateX(" + this.listOffset + "px)";
			}
		},
	},
}
</script>

<style scoped>
.small-list {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	transition-duration: var(--transition);
}

.list-title {
	color: white;
	line-height: var(--list-title-h);
}

.carrousel-arrow {
	position: absolute;
	left: 1300px;
	transform: translateY(-220%);
}

.carrousel-arrow img {
	transition-duration: var(--transition);
}
</style>