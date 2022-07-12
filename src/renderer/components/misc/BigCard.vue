<template>
	<div v-if="content && content.logo && content.name" class="big-card flipX" :class="active ? 'active' : 'inactive'">
		<div class="flip-inner" :class="isFliped ? 'fliped' : ''">
			<div class="flip-front">
				<div class="card-img" :style="image">
					<div v-if="content.description" class="card-desc transparent-box">
						<div class="padded">
							<div class="text">
								{{ content.description }}
							</div>
							<div v-if="type=='game'" class="meta-infos very-small-font">
								<div class="badge" style="background-color:var(--light-brown-color); color: black;">
									{{content.nb_players}} joueurs
								</div>
								<div class="badge">
									# {{content.type}}
								</div>
							</div>
						</div>
					</div>
					<div class="card-border"></div>
				</div>
				<div class="title transparent-box  bold-font" :class="active ? 'very-big-font' : 'big-font'">
					<p>{{ content.name }}</p>
				</div>
			</div>
			<div class="flip-back">
				<div class="video" v-if="type == 'campaign' && isFliped && active">
					<youtube :video-id="content.video" :player-vars="playerVars" :fitParent="true" ref="youtube" @ready="playVideo" style="width: 100%;"></youtube>
				</div>
			</div>
		</div>
	
		<div class="gamepadControls" v-if="active">
			<div v-gamepad:button-b="simulate_a"></div>
			<span v-gamepad:left-analog-down="simulate_down"></span>
		</div>
	</div>
</template>

<script>

export default {
	watch: {
		active: function(newVal, oldVal) {
			if (newVal == false) {
				this.isFliped = false;
			}
		}
	},
	created() {
		if (this.content !== undefined)
			this.image = "background-image: url('" + this.content.logo + "');" +
			"background-position: center;" +
			"background-size: cover;" +
			"background-repeat: no-repeat;";
	},
	methods: {
		toggleFlip: function() {
			this.isFliped = !this.isFliped;
		},
		simulate_a() {
			if (this.active) {
				// console.log(this.content);
				this.$emit("chose", this.content);
			}
		},
		simulate_down() {
			if (this.type == 'campaign') {
				this.toggleFlip();
			}
		},
		playVideo: function() {
			this.$refs.youtube.player.playVideo();
		}
	},
	data() {
		return {
			image: "",
			isFliped: false,
			playerVars: {
				autoplay: 1,
				iv_load_policy: 3,
				playsinline: 1,
				controls: 0,
				modestbranding: 1,
				showinfo: 0,
				rel: 0,
				cc_load_policy: 0,
			},
		}
	},
	props: [
		"content",
		"active",
		"type",
	],

}
</script>

<style scoped>
.big-card.active {
	--size: calc(var(--card-h) * 2);
}

.big-card {
	--size: var(--card-h);
	margin: var(--margin);
	height: var(--size);
	width: var(--size);
	border-radius: var(--radius);
	box-shadow: 0 130px 100px -50px black;
}

.transparent-box,
.title.transparent-box {
	transition-delay: 0s;
	transition: all var(--transition) ease;
}

.card-desc {
	position: absolute;
	bottom: 0;
	background: var(--std-opacity);
	border-radius: calc(var(--radius));
	height: min-content;
	margin: 0;
}

.card-desc .padded{
	padding: 20px 10% 50px 10%;
}

.card-desc .text {
	line-height: initial;
	color: var(--light-brown-color);
	padding-bottom: 20px;
}

.big-card.inactive .card-img {
	filter: var(--grayscale);
}

.big-card.inactive .card-desc.transparent-box {
	transform: translateY(100%);
	width: calc(2 * var(--size));
}

.big-card.active .card-desc.transparent-box {
	transform: translateY(0%);
	width: var(--size);
	transition-delay: var(--transition);
}

.title.transparent-box {
	position: absolute;
	top: 10%;
}

.title.transparent-box p {
	padding: var(--margin);
}

.active .title.transparent-box p {
	-webkit-text-stroke: 1px grey;
	color: var(--white-color);
}

.flip-back {
	background: black;
	display: flex;
	align-items: center;
}

.video {
	width: 100%;
}
</style>