const extractURLId = (url: string) => {
	let urlId: string = '';
	if (url.includes('watch?v=')) {
		const urlParts = url.split('watch?v=');
		urlId = urlParts[1];
	} else if (url.includes('embed')) {
		const urlParts = url.split('embed/');
		urlId = urlParts[1];
	}

	return urlId;
};

const makeEmbedURL = (url: string) => {
	let newUrl;

	if (!url.includes('embed')) {
		const urlParts = url.split('watch?v=');
		newUrl = urlParts[0] + 'embed/' + urlParts[1] + `?enablejsapi=1`

		return newUrl;
	} else {
		return url;
	}
};

const thumbnailURL = (id: string) => {
	console.log({id})
	return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export const youtubeURLs = {
	extractURLId,
	makeEmbedURL,
	thumbnailURL
};
