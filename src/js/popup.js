const refs = {
	lightbox: document.querySelector(".js-lightbox"),
	lightboxImage: document.querySelector(".lightbox-image"),
	lightboxOverlay: document.querySelector(".lightbox-overlay"),
	btnClose: document.querySelector(".js-close")
}

function startPopup(url) {
	refs.lightboxImage.src = url;
	refs.lightbox.classList.add("is-open");
	refs.btnClose.addEventListener("click", closePopup);
	refs.lightboxOverlay.addEventListener("click", closePopup);
	window.addEventListener("keyup", closePopup);
}

function closePopup({ type, key }) {
	const clearPopup = () => {
		refs.lightboxImage.src = "";
		refs.lightbox.classList.remove("is-open");
		refs.btnClose.removeEventListener("click", closePopup);
		refs.lightboxOverlay.removeEventListener("click", closePopup);
		window.removeEventListener("keyup", closePopup);
	}

	if (type === "keyup") {
		if (key === "Escape") {
			clearPopup();
		}
	} else {
		clearPopup();
	}
}

export { refs, startPopup, closePopup };