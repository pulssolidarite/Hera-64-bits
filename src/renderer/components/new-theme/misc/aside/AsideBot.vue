<template>
	<div id="aside-bot" class="bold-font">

		<div class="brown inline-txt-img center-items">
			<div class="inline-img"><img class="inline-img" src=""></div>
			<div class="inline-txt">
				<div class="big-font">comment naviguer</div>
			</div>
		</div>
		<div class="center-items">
			<div class="inline-block block-txt-img"><img class="block" src="">valider</div>
			<div class="inline-block block-txt-img"><img class="block" src="">retour</div>
			<div class="inline-block block-txt-img"><img class="block" src="" style="width:200px">déplacer</div>
		</div>

		<hr>

		<div id="infos" class="inline-txt-img center-items">
			<div class="inline-img"><img src=""></div>
			<div class="inline-txt">
				<div class="over small-font"><u>info@arcade-for-good.com</u></div>
				<div class="under brown small-font">made in 2022 by Puls-Impact</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#aside-bot {
	--std-height: 50px;
	background: #eeede9;
	height: 25%;
	width: 100%;
	border-radius: 20px;
	bottom: 0;
	position: absolute;
	
}

#infos{
	margin-top: 25px;
}

.inline-txt-img{
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	position: relative;
	width: var(--aside-w);
	height: var(--std-height);
	margin: var(--margin) 0 var(--margin) 0;
}

	.inline-img{
	}
	.inline-img img{
		margin: 0 calc(2 * var(--margin)) 0 0;
		background: red;
		height: var(--std-height);
		width: var(--std-height);
	}

	.inline-txt{
		line-height: var(--std-height);
		height: var(--std-height);
	}

.over, .under{
	line-height: calc(var(--std-height) / 2);
	/* font-size: calc(var(--std-height) / 2); */
}

.center-items{
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}

.block-txt-img{
	text-align: center;

}
.block-txt-img img {
		margin: 0 var(--margin) 0 var(--margin);
		background: red;
		height: var(--std-height);
		width: var(--std-height);
	
}
</style>