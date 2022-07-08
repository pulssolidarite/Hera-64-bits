<template>
	<div id="play-game">
		<!-- https://github.com/SnosMe/electron-overlay-window/blob/master/src/demo/electron-demo.ts -->
		<div class="overlay bold-font">
			<div class="phrase">
				<div class="over very-big-font">arcade</div>
				<div class="under">for good</div>
			</div>
			<div class="end">
				<div class="timer very-big-font">{{ timeLeft }}</div>
				<div class="separator"></div>
				<div class="home"><img src="@/assets/img/exports/icone-maison.svg"></div>
			</div>
		</div>
	</div>
</template>

<script>
const { remote } = require("electron")
var intervalTimer;
export default {
	created() {
		remote.getCurrentWindow().setFullScreen(false);
		remote.getCurrentWindow().setBounds({ x: 0, y: 0, height: 80 })
	},
	name: "Play",
	props: ["session"],
	data: function() {
		return {
			currentGame: this.$store.state.currentGame,
			loading: false,
			status: "",
			selectedTime: 0,
			timeLeft: '00:00',
			endTime: '0',
		};
	},
	mounted: function() {
		// console.log(this.session.terminal.play_timer);
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
		this.setTime(this.session.terminal.play_timer * 60)
	},
	methods: {
		setTime(seconds) {
			clearInterval(intervalTimer);
			this.timer(seconds);
		},
		timer(seconds) {
			const now = Date.now();
			const end = now + seconds * 1000;
			this.displayTimeLeft(seconds);

			this.selectedTime = seconds;
			this.displayEndTime(end);
			this.countdown(end);
		},
		countdown(end) {
			intervalTimer = setInterval(() => {
				const secondsLeft = Math.round((end - Date.now()) / 1000);

				if (secondsLeft === 0) {
					this.endTime = 0;
				}

				if (secondsLeft < 0) {
					clearInterval(intervalTimer);
					return;
				}
				this.displayTimeLeft(secondsLeft)
			}, 1000);
		},
		displayTimeLeft(secondsLeft) {
			const minutes = Math.floor((secondsLeft % 3600) / 60);
			const seconds = secondsLeft % 60;

			this.timeLeft = `${this.zeroPadded(minutes)}:${this.zeroPadded(seconds)}`;
		},
		displayEndTime(timestamp) {
			const end = new Date(timestamp);
			const hour = end.getHours();
			const minutes = end.getMinutes();

			this.endTime = `${this.hourConvert(hour)}:${this.zeroPadded(minutes)}`
		},
		zeroPadded(num) {
			return num < 10 ? `0${num}` : num;
		},
		hourConvert(hour) {
			return (hour % 12) || 12;
		},
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
			if (this.session.terminal.play_timer) {
				setTimeout(function() {
					exec('killall "retroarch"');
				}, 1000 * 60 * this.session.terminal.play_timer); // milisecond*second*minute
			}
		},
		endGame: function() {
			this.loading = false;
			this.$emit("home");
			remote.getCurrentWindow().setFullScreen(true);
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
	height: 80px;
	/* opacity: .7; */
	background: var(--white-color);
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: 0;
	padding-left: var(--margin);
	color: var(--blue-color);
}

.end {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	margin-right: var(--margin);
}

.end>*:not(.separator) {
	padding-left: var(--margin);
	padding-right: var(--margin);
}

.separator {
	background: rgb(124, 124, 124);
	height: 50px;
	width: 1px;
}

.phrase {
	text-align: center;
	height: min-content;
}

.over,
.under {
	line-height: 80%;
}

.under {
	font-size: 31px;
}

.home img {
	width: 40px;
}
</style>