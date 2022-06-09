<template>
	<div id="presentation-list">
		<div class="list-title">tous nos jeux</div>
		<!-- <Transition name="game-list"> -->
		<div class="game-list" ref="gameList">
			<div class="small-card" :class="isActiveCard(i)" ref="smallCard" v-for="(c, i) in content" :key="i">
				<div class="transparent-box">
					<p>{{ c.name }}</p>
				</div>
				<img :src="c.logo" class="slide-picture" />
				<!-- <span class="slide-description">
														{{ game.description }}
													</span> -->
			</div>
		</div>
		<!-- </Transition> -->
	
		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />
	
	</div>
</template>

<script>
import HelpGamepad from "@/components/helpGamepad.vue";

export default {
	data() {
		return {
			activeIndex: 0,
			gameListOffsetFactor: 0,
			gameListOffset: 0,
		}
	},
	mounted: function() {
		this.gameListOffsetFactor = this.getGameListOffsetFactor();
	},
	components: {
		HelpGamepad,
	},
	props: [
		"content",
		"active",
	],
	methods: {
		isActiveCard: function(i) {
			return (i == this.activeIndex && this.active ? "active" : "inactive");
		},
		simulate_a() {
		},
		simulate_b() {
		},
		simulate_left() {
			this.moveSelection(-1);
		},
		simulate_right() {
			this.moveSelection(1);
		},
		getGameListOffsetFactor() {
			if (this.$refs.smallCard === undefined)
				return
			return parseInt(window.getComputedStyle(this.$refs.smallCard[0]).width) + parseInt(window.getComputedStyle(this.$refs.smallCard[0]).marginRight);
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
					this.gameListOffset += this.gameListOffsetFactor * -direction;
				} else {
					this.gameListOffset = 0;
				}
				this.$refs.gameList.style.transform = "translateX(" + this.gameListOffset + "px)";
			}
		},
	},
}
</script>

<style>
.game-list {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	transition-duration: 500ms;
}

.small-card {
	flex-shrink: 0;
}
</style>