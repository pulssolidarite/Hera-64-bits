<template>
	<div id="big-carrousel">
		<div class="big-list" ref="list">
			<div class="list-wrapper">
				<BigCard
					:active="isActiveCard(i)"
					v-for="(card, i) in content"
					:key="i"
					:content="card"
					class="big-card"
					@chose="chose">
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
		BigCard,
	},
	props: [
		"content",
		"active",
		"session",
	],
	methods: {
		chose(data){
			if(this.active)
				this.$emit("chose", data)
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
			var cards = document.getElementsByClassName("big-card");
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
.big-list {
	/* top: calc(var(--inline-stepping-h) + 2* var(--margin)); */
	top: 25%;
	position: absolute;
	height: var(--big-carrousel-h);
}

.list-wrapper{
	height: var(--big-carrousel-h);
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	transition-duration: var(--transition);
}
</style>