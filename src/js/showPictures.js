import fetchPictures from "./apiService.js";
import * as popup from "./popup.js";
import pictureCard from "../templates/picture.hbs";
import _ from "lodash";
import { error, notice, defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
	input: document.querySelector(".search-input"),
	output: document.querySelector(".response"),
	btnLoad: document.querySelector(".load-btn"),
	btnClear: document.querySelector(".js-clear")
}
let page = 1;
let startPoint = 75;
let currentHeight = 0;
defaults.delay = '1000';
defaults.width = '500px';

refs.input.addEventListener("input", _.debounce(makeRequest, 500));
refs.btnLoad.addEventListener("click", makeRequest);
refs.btnClear.addEventListener("click", clearAll);
refs.output.addEventListener("click", checkClick);

function makeRequest(evt) {
	if (!refs.input.value) {
		clearAll();
		notice({ text: "Please input what you are looking for" });
	}
	else {
		if (evt.type === "click") {
			page += 1;
			currentHeight = refs.output.offsetHeight;
		}
		else {
			page = 1;
			currentHeight = 0;
			refs.output.innerHTML = "";
		}

		fetchPictures(refs.input.value, page).then(data => {
			if (data.totalHits) { renderPage(data.hits); }
			else { notice({ text: "Nothing was found" }) }
		}).catch(error => error({ text: `${error}` }));
	}
}

function renderPage(arr) {
	const markup = `<ul class="gallery">${arr.reduce((acc, el) => acc + pictureCard(el), "")}</ul>`;
	refs.output.insertAdjacentHTML("beforeend", markup);
	if (refs.output.offsetHeight + startPoint > currentHeight) {
		window.scrollTo({
			top: currentHeight,
			left: 0,
			behavior: 'smooth'
		});
	}
}

function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
}

function checkClick(evt) {
	if (evt.target.tagName === "IMG") {
		popup.startPopup(evt.target.dataset.url);
	}
}