import { SourcNameMaxLength } from '$lib/consts';
import { sliceString } from './sliceString';

const YOUTUBE_PATTERNS = [
	// Standard URL: https://www.youtube.com/watch?v=VIDEO_ID
	/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
	// Short URL: https://youtu.be/VIDEO_ID
	/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
	// Embed URL: https://www.youtube.com/embed/VIDEO_ID
	/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
	// Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
	/(?:https?:\/\/)?m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
];

const extractURLId = (url: string): string | null => {
	if (!url || typeof url !== 'string') {
		return null;
	}

	for (const pattern of YOUTUBE_PATTERNS) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
};

const makeEmbedURL = (url: string): string | null => {
	const videoId = extractURLId(url);
	if (!videoId) {
		return null;
	}

	const params = new URLSearchParams({
		enablejsapi: '1',
		controls: '1',
		modestbranding: '1',
		rel: '0',
		autoplay: '0'
	});

	return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const thumbnailURL = (
	id: string,
	quality: 'maxres' | 'hq' | 'mq' | 'default' = 'maxres'
): string => {
	const qualityMap = {
		maxres: 'maxresdefault',
		hq: 'hqdefault',
		mq: 'mqdefault',
		default: 'default'
	};

	return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
};

const getVideoName = async (url: string): Promise<string> => {
	const videoId = extractURLId(url);
	if (!videoId) {
		return '';
	}

	try {
		const response = await fetch(
			`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
		);
		const data = await response.json();
		const name = data?.title || '';

		return sliceString(name, SourcNameMaxLength);
	} catch (error) {
		console.error('Error al obtener nombre del video:', error);
		return '';
	}
};

const isValidYouTubeUrl = (url: string): boolean => {
	return extractURLId(url) !== null;
};

export const youtubeURLs = {
	extractURLId,
	makeEmbedURL,
	thumbnailURL,
	getVideoName,
	isValidYouTubeUrl
};
