import fetchPictures from "./apiService.js";
import * as popup from "./popup.js";
import pictureCard from "../templates/picture.hbs";
import _ from "lodash";
import { notice, defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
	input: document.querySelector(".search-input"),
	output: document.querySelector(".js-response"),
	btnClear: document.querySelector(".js-clear"),
	observerTarget: document.querySelector(".target")
}
let page = 1;
defaults.delay = '2000';
defaults.width = '500px';

const options = {
	root: null,
	rootMargin: '150px',
}
const observer = new IntersectionObserver(intersectionCallback, options);

refs.input.addEventListener("input", _.debounce(makeRequest, 500));
refs.btnClear.addEventListener("click", clearAll);
refs.output.addEventListener("click", checkClick);

function intersectionCallback(entries) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			page += 1;
			fetchPage(page);
		}
	});
}

function makeRequest() {
	if (refs.input.value !== "") {
		page = 1;
		refs.output.innerHTML = "";
		fetchPage(page);
		observer.observe(refs.observerTarget);
	} else {
		clearAll();
	}
}

function fetchPage(newPage) {
	fetchPictures(refs.input.value, newPage)
		.then(data => {
			if (data.totalHits) {
				renderPage(data.hits);
			}
			else {
				notice({ text: "Nothing was found" });
			}
		})
		.catch(error => notice({ text: `${error}` }));
}

function renderPage(arr) {
	const markup = `${arr.reduce((acc, el) => acc + pictureCard(el), "")}`;
	refs.output.insertAdjacentHTML("beforeend", markup);
}

function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
	observer.unobserve(refs.observerTarget);
}

function checkClick(evt) {
	if (evt.target.tagName === "IMG") {
		popup.startPopup(evt.target.dataset.url);
	}
}

