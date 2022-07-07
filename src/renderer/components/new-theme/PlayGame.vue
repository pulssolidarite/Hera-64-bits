<template>
	<div id="play-game">
		<!-- https://github.com/SnosMe/electron-overlay-window/blob/master/src/demo/electron-demo.ts -->
		<!-- <div class="overlay bold-font">
			<div class="phrase">
				<div class="over very-big-font">arcade</div>
				<div class="under">for good</div>
			</div>
			<div class="end">
				<div class="timer very-big-font">5:00</div>
				<div class="separator"></div>
				<div class="home"><img src="@/assets/img/exports/icone-maison.svg"></div>
			</div>
		</div> -->
		<!-- <vue-element-loading :active="loading" is-full-screen /> -->
	</div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
// import { overlayWindow } from '../../../../';

export default {
	name: "Play",
	props: ["session"],
	data: function() {
		return {
			currentGame: this.$store.state.currentGame,
			loading: false,
			status: "",
		};
	},
	components: {
		VueElementLoading,
	},
	mounted: function() {
		
		// This View is used to launch the game
		this.loading = true;

		// We first launch the timer for the game session and we also stop listening to the Gamepad for now
		// to prevent missclick...
		this.$emit("startGameSession");

		// We then prepare the command and we launch it in a separate Node.js shell
		const pathToCore = process.env.HOME + "/games/cores/" + this.session.game.core.path;
		const pathToGame = process.env.HOME + "/games/roms/" + this.session.game.path;

		let command = 'retroarch -f -L "' + pathToCore + '" "' + pathToGame + '"';
		// console.log(command);
		this.startShell(command);
		
		// window.webContents.openDevTools({ mode: 'detach', activate: false });
		// overlayWindow.attachTo(window, 'retroarch');
	},
	methods: {
		startShell: function(command) {
			// We launch a child process containing a Retroarch session
			var exec = require("child_process").exec;
			var shell = exec(command, (error, stdout, stderr) => {
				if (error) {
					// console.log(error);
					this.status = error;
					this.loading = false;
					this.endGame();
				} else {
					this.status = stdout;

					this.endGame();
				}
			});
			// We use a global timer to kill the game after 10 minutes
			// TO-DO : maybe add a message that the time is out
			var timer;
			if (this.session.terminal.play_timer) {
				timer = setTimeout(function() {
					exec('killall "retroarch"');
				}, 1000 * 60 * this.session.terminal.play_timer); // milisecond*second*minute
			} else {
				timer = setTimeout(function() {
					exec('killall "retroarch"');
				}, 1000 * 60 * 10); // milisecond*second*minute
			}
		},
		endGame: function() {
			this.loading = false;
			this.$emit("home");
		},
	},
};
</script>

<style scoped>
#play-game {
	height: var(--max-h);
}

.overlay {
	width: 100%;
	opacity: .7;
	background: var(--white-color);
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: 0;
	padding: var(--margin);
	color: var(--blue-color);
}

.end {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	margin-right: var(--margin);
}
.end>*:not(.separator){
	padding-left: var(--margin);
	padding-right: var(--margin);
}

.separator{
	background: rgb(124, 124, 124);
	height: 50px;
	width: 1px;
}

.phrase{
	text-align: center;
	height: min-content;
}

.over, .under{
	line-height: 80%;
}

.under{
	font-size: 31px;
}

.home img{
	width: 40px;
}

</style>