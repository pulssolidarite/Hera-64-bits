<template>
	<div id="small-carrousel">
		<div class="list-title bold-font big-font">{{ title }}</div>
		<div class="small-list" ref="list">
			<SmallCard
				:active="isActiveCard(i)"
				v-for="(card, i) in content"
				:key="i"
				:content="card"
				@chose="chose">
			</SmallCard>
		</div>
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";
import SmallCard from "@/components/new-theme/misc/SmallCard.vue";

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
		HelpGamepad,
		SmallCard,
	},
	props: [
		"content",
		"active",
		"title",
	],
	methods: {
		chose(data){
			// console.log("chose: ",data);
			if(this.active)
				this.$emit("carrouselChose", data)
		},
		isActiveCard: function(i) {
			return (i == this.activeIndex && this.active ? true: false);
		},
		simulate_a() {},
		simulate_b() {},
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
				} else {
					this.listOffset = 0;
				}
				this.$refs.list.style.transform = "translateX(" + this.listOffset + "px)";
			}
		},
	},
}
</script>

<style>
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
</style>