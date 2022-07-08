<template>
	<div :class="isActive()" v-if="content">
	
		<div class="fav-img" :style="getImageStyle()">
			<div class="card-border"></div>
		</div>
	
		<div class="description big-font bold-font" :class="(more ? 'in' : 'out')">
			<div>
				{{ content.description }}
			</div>
		</div>
		
		<div class="fav-wrapper">
			<div class="transparent-box">
				<p class="bold-font very-big-font">le jeu du moment</p>
			</div>
	
			<div class="campaign-name bold-font">{{ content.name }}</div>
	
	
			<div class="buttons">
				<FavButton :button="favoriteButtons[i]" :active="isActiveButton(i)" v-for="(button, i) in favoriteButtons" :key="i" @selection="selection">
				</FavButton>
			</div>
		</div>

		<div class="gamepadControls" v-if="active">
			<span v-gamepad:left-analog-left="simulate_left"></span>
			<span v-gamepad:left-analog-right="simulate_right"></span>
		</div>
	</div>
</template>

<script>
import FavButton from "@/components/new-theme/misc/FavButton.vue";
export default {
	components: {
		FavButton,
	},
	data() {
		return {
			activeButtonIndex: 0,
			more: false,
		}
	},
	props: [
		"content",
		"active",
		"favoriteButtons",
		"action",
		"type",
	],
	methods: {
		getImageStyle: function() {
			return "background-image: url('" + this.content.logo + "');" +
				"background-position: center;" +
				"background-size: cover;" +
				"background-repeat: no-repeat;";
		},
		selection: function(action) {
			if (this.active) {
				// console.log("action, this.content", action, this.content);
				this.$emit(action, { content: this.content, type: this.type })
				if (action == "more"){
					this.more = true;
				} else if (action == "back") {
					this.more = false;
				}
			}
		},
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
		isActiveButton(i) {
			return i == this.activeButtonIndex && this.active ? true : false;
		},
		simulate_left() {
			// console.log("move left");
			this.moveSelection(-1);
		},
		simulate_right() {
			// console.log("move right");
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
			}
		},
	},
}
</script>

<style scoped>
.fav-wrapper {
	--padding: 100px;
	padding-left: var(--padding);
	position: absolute;
	top: 50px;
	width: calc(var(--favorite-w) - var(--padding))
}

.fav-img {
	position: absolute;
}

.campaign-name {
	font-size: 100px;
	color: var(--white-color);
	text-transform: capitalize;
	-webkit-text-stroke: 2px rgb(82, 82, 82);
	max-width: 50%;
}

.buttons {
	margin-top: 50px;
}

.description {
	height: 100%;
	width: 40%;
	color: var(--white-color);
	-webkit-text-stroke: 1px black;
	background-color: var(--std-opacity);
	position: absolute;
	top: 0;
	right: 0;
	transition: all var(--transition) ease;
}

	.in{
		transform: translateX(0%);
	}

	.out{
		transform: translateX(100%);
	}

.description>div{
	padding: 30px;
	margin: 0;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}
</style>