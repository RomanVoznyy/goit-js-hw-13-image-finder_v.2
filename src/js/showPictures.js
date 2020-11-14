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
let totalHits = 0;
defaults.delay = '2000';
defaults.width = '500px';

refs.input.addEventListener("input", _.debounce(makeRequest, 500));
refs.btnClear.addEventListener("click", clearAll);
refs.output.addEventListener("click", checkClick);

function makeRequest() {
	if (refs.input.value !== "") {
		clear();
		page = 1;
		observer.observe(refs.observerTarget);
	} else {
		clearAll();
	}
}

const options = {
	root: null,
	rootMargin: '150px',
}
const observer = new IntersectionObserver(intersectionCallback, options);

function intersectionCallback(entries) {
	entries.forEach(entry => {
		if (entry.isIntersecting && refs.observerTarget.textContent === "") {
			fetchPage(page);
			page += 1;
		}
	});
}

function fetchPage(newPage) {
	fetchPictures(refs.input.value, newPage)
		.then(data => {
			if (data.totalHits) {
				totalHits = data.totalHits;
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

	lazyLoad(document.querySelectorAll('img[data-status="new"]'));
	if (refs.output.childElementCount === totalHits) {
		refs.observerTarget.textContent = "This is the end of the library";
	}
}

function lazyLoad(images) {
	images.forEach(image => {
		image.dataset.status = "old";
		image.setAttribute("src", image.dataset.src);
	})
}

function clear() {
	refs.output.innerHTML = "";
	observer.unobserve(refs.observerTarget);
	refs.observerTarget.textContent = "";
}

function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
	observer.unobserve(refs.observerTarget);
	refs.observerTarget.textContent = "";
}

function checkClick(evt) {
	if (evt.target.tagName === "IMG") {
		popup.startPopup(evt.target.dataset.url);
	}
}

