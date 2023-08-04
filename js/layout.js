let listElements = [];
let playOrder = [];
let playOrderIndex = null;
let isShuffled = false;
let autoPlayTimeoutId = null;

function getInputAudios() {
	return filesList;
}

function getPlayer() {
	return document.getElementById("player");
}

function getList() {
	return document.getElementById("playList");
}

function getPreviousBtn() {
	return document.getElementById("previousBtn");
}

function getNextBtn() {
	return document.getElementById("nextBtn");
}

function getShuffleBtn() {
	return document.getElementById("shuffleBtn");
}

function getUnshuffleBtn() {
	return document.getElementById("unshuffleBtn");
}

function isAutoPlay() {
	return document.getElementById("autoPlay").checked;
}

function isRepeat() {
	return document.getElementById("repeat").checked;
}

function getTimeBetweenSongs() {
	let seconds = parseFloat(document.getElementById("timeBetweenSongs").value);
	if (isNaN(seconds)) seconds = 0;
	return seconds;
}

function stopAutoPlayTimeout() {
	if (autoPlayTimeoutId != null) {
		clearTimeout(autoPlayTimeoutId);
		autoPlayTimeoutId = null;
	}
}

function setFileName(name) {
	document.getElementById("fileName").innerHTML = name;
	window.document.title = name;
}

function play(index) {
	let files = getInputAudios();
	getPlayer().src = files[index];
	player.play();
	enableBtns();
}


function playNext() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (playOrder.length > playOrderIndex + 1) playOrderIndex++;
	else playOrderIndex = 0;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
	setFileName(playOrder[playOrderIndex].innerHTML);
}

function playPrevious() {
	playOrder[playOrderIndex].classList.remove("playing");
	if (-1 < playOrderIndex - 1) playOrderIndex--;
	else playOrderIndex = playOrder.length - 1;
	play(playOrder[playOrderIndex].getAttribute("index"));
	playOrder[playOrderIndex].classList.add("playing");
	setFileName(playOrder[playOrderIndex].innerHTML);
}

function shuffleList() {
	for (let i = playOrder.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[playOrder[i], playOrder[j]] = [playOrder[j], playOrder[i]]; //swap i j

		if (i == playOrderIndex) playOrderIndex = j;
		else if (j == playOrderIndex) playOrderIndex = i;
	}
	[playOrder[playOrderIndex], playOrder[0]] = [
		playOrder[0],
		playOrder[playOrderIndex],
	]; //swap playOrderIndex 0
	playOrderIndex = 0;
	isShuffled = true;
}

function unshuffleList() {
	playOrderIndex = parseInt(playOrder[playOrderIndex].getAttribute("index"));
	playOrder = [...listElements];
	isShuffled = false;
}

getPlayer().addEventListener("play", () => {
	stopAutoPlayTimeout();
});

getNextBtn().addEventListener("mouseup", () => {
	disableBtns();
	if (listElements.length) {
		playNext();
	}
});

getPreviousBtn().addEventListener("mouseup", () => {
	disableBtns();
	if (listElements.length) {
		playPrevious();
	}
});

getShuffleBtn().addEventListener("mouseup", (event) => {
	disableBtns();
	if (listElements.length) {
		shuffleList();
		event.target.innerHTML = "Reshuffle";
	}
	enableBtns();
});

getUnshuffleBtn().addEventListener("mouseup", () => {
	disableBtns();
	if (listElements.length) {
		unshuffleList();
		getShuffleBtn().innerHTML = "Shuffle";
	}
	enableBtns();
});

function handleListItemClickEvent(element) {
	disableBtns();

	let index = parseInt(element.getAttribute("index"));
	play(index);
	playOrder[playOrderIndex].classList.remove("playing");
	element.classList.add("playing");
	setFileName(listElements[index].innerHTML);

	if (isShuffled) {
		let elementOrderIndex = playOrder.indexOf(element);
		if (elementOrderIndex < playOrderIndex)
			//swap elementOrderIndex playOrderIndex
			[playOrder[elementOrderIndex], playOrder[playOrderIndex]] = [
				playOrder[playOrderIndex],
				playOrder[elementOrderIndex],
			];
		//swap elementOrderIndex playOrderIndex+1
		else
			[playOrder[elementOrderIndex], playOrder[++playOrderIndex]] = [
				playOrder[playOrderIndex],
				playOrder[elementOrderIndex],
			];
	} else {
		playOrderIndex = index;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	disableBtns();

	let files = getInputAudios();

	let firstPlayIndex = 0;
	getPlayer().src = files[firstPlayIndex];
	enableBtns();

	let isShuffled = false;
	getShuffleBtn().innerHTML = "Shuffle";

	let list = getList();
	//clear list
	list.innerHTML = "";
	//load list
	let listItems = document.createElement("DIV");

	for (i = 0; i < files.length; i++) {
		let listItem = document.createElement("LI");
		listItem.classList.add("media-list-item");
		listItem.setAttribute("index", i);

		let name = files[i];
		name = name.substring(name.lastIndexOf("/") + 1, name.lastIndexOf("."));
		listItem.innerHTML = name;
		if (i == firstPlayIndex) {
			listItem.classList.add("playing");
			setFileName(name);
		}
		listItem.setAttribute("onmouseup", "handleListItemClickEvent(this)");

		listItems.appendChild(listItem);
	}
	list.innerHTML = listItems.innerHTML;

	listElements = [...list.children];
	playOrder = [...listElements]; //default play order
	playOrderIndex = firstPlayIndex;
});

getPlayer().addEventListener("ended", function (event) {
	if (isAutoPlay()) {
		let oldIndex = playOrderIndex;
		if (isRepeat())
			playOrderIndex = (playOrderIndex + 1) % playOrder.length;
		else if (playOrder.length > playOrderIndex + 1)
			playOrderIndex++;
		else return;
		autoPlayTimeoutId = setTimeout(function () {
			disableBtns();
			playOrder[oldIndex].classList.remove("playing");
			play(playOrder[playOrderIndex].getAttribute("index"));
			playOrder[playOrderIndex].classList.add("playing");
			setFileName(playOrder[playOrderIndex].innerHTML);
		}, getTimeBetweenSongs() * 1000);
	}
});

function disableBtns() {
	getNextBtn().disabled = true;
	getPreviousBtn().disabled = true;
	getShuffleBtn().disabled = true;
	getUnshuffleBtn().disabled = true;

	for (let i = 0; i < listElements.length; i++) {
		listElements[i].setAttribute("onmouseup", null);
	}
}

function enableBtns() {
	getNextBtn().disabled = false;
	getPreviousBtn().disabled = false;
	getShuffleBtn().disabled = false;
	getUnshuffleBtn().disabled = false;

	for (let i = 0; i < listElements.length; i++) {
		listElements[i].setAttribute(
			"onmouseup",
			"handleListItemClickEvent(this)"
		);
	}
}
