<template>
	<div id="favorite" :class="isActive()" :style="image">
		<div>
			<div class="transparent-box">
				<p class="bold-font">le jeu du moment</p>
			</div>

			<div class="campaign-name">{{ content.name }}</div>
		
			<div class="buttons">
				<FavButton :text="favoriteButtons[i].text" :active="isActiveButton(i)" v-for="(button, i) in favoriteButtons" :key="i"></FavButton>
			</div>
		</div>

		<!-- GAMEPAD -->
		<helpGamepad :gpio_help="1" @simulate_a="simulate_a" @simulate_b="simulate_b" @simulate_left="simulate_left" @simulate_right="simulate_right" />

	</div>
</template>

<script>
import FavButton from "@/components/new-theme/misc/FavButton.vue";
import HelpGamepad from "@/components/helpGamepad.vue";
export default {
	components: {
		FavButton,
		HelpGamepad,
	},
	data() {
		return {
			image: "background-image: url('" + this.content.logo + "');" +
				"background-position: center;" +
				"background-size: cover;" +
				"background-repeat: no-repeat;",
			activeButtonIndex: 0,
		}
	},
	props: [
		"content",
		"active",
		"favoriteButtons",
	],
	methods: {
		isActive() {
			if (this.active) {
				if (this.activeButtonIndex == -1) {
					this.activeButtonIndex = 0;
				}
				return "active";
			} else {
				this.activeButtonIndex = -1;
				return "inactive";
			}
		},
		isActiveButton(i){
			return i == this.activeButtonIndex ? true : false;
		},
		simulate_a() {},
		simulate_b() {},
		simulate_left() {
			this.moveSelection(-1);
		},
		simulate_right() {
			this.moveSelection(1);
		},

		moveSelection(direction) { // direction must be -1 or +1 for left or right
			if (direction != 1 && direction != -1 || !this.active)
				return;

			var limit = (direction == 1 ? this.favoriteButtons.length : -1);
			if (this.activeButtonIndex + direction == limit) {
				return;
			} else {
				this.activeButtonIndex += direction;
			console.log(this.activeButtonIndex);
			}
		},
	},
}
</script>

<style>

#favorite>div {
	padding-left: 100px;
	height: var(--favorite-h);
}

.campaign-name {
	font-size: 80px;
	position: absolute;
	top : 100px;
	color: var(--white-color);
	text-transform: capitalize;
	-webkit-text-stroke: 2px black;
}

.buttons {
	position: absolute;
	bottom: 50px;
}
</style>