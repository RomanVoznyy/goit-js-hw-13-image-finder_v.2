export default function pictureRequest(name, page) {
	return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${name}&page=${page}&per_page=12&key=18895827-cf969cabaa6d7255b0d8616bb`).
		then(data => data.json()).catch(error => error);
}

// export default async (name, page) => {
// 	try {
// 		const picturesList = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${name}&page=${page}&per_page=12&key=18895827-cf969cabaa6d7255b0d8616bb`);
// 		return picturesList.json();
// 	} catch (error) {
// 		return error;
// 	}
// }