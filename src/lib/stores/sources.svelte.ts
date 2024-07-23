import type { Source } from '$lib/types/Source';

interface SourceState {
	loaded: boolean;
	list: Source[];
	pinned: Source[];
	isDeleting: boolean;
	deleteSuccess: boolean;
}

export const sources = $state<SourceState>({
	loaded: false,
	list: [],
	pinned: [],
	isDeleting: false,
	deleteSuccess: false
});

export const initSources = () => {
	sources.list = loadSourcesFromLocalStorage();
	sources.loaded = true;
};

export const addSource = (source: Source) => {
	if (!source) return;
	if (!sources) return;

	sources.list.push(source);
	saveSourceToLocalStorage(source);
};

export const deleteSource = (id: string) => {
	if (!id) return;
	if (!sources?.list?.length) return;

	sources.list = sources.list.filter((source) => source.id !== id);
	sources.pinned = sources.pinned.filter((source) => source.id !== id);
	deleteSourceFromLocalStorage(id);
	sources.deleteSuccess = true;
};

export const deleteAllSources = () => {
	sources.list = [];
	sources.pinned = [];
};

export const toggleDeleteMode = () => {
	sources.isDeleting = !sources.isDeleting;
};

export const toggleDeleteSuccess = () => {
	sources.deleteSuccess = !sources.deleteSuccess;
};

export const pinSource = (source: Source) => {
	if (!source) return;

	sources.pinned.push(source);
};

export const unpinSource = (source: Source) => {
	if (!source) return;

	sources.pinned = sources.pinned.filter((pinned) => pinned.id !== source.id);
};

function saveSourceToLocalStorage(source: Source) {
	if (!source) return;
	if (!source.id) return;
	if (!source.url) return;

	localStorage.setItem(`source-${source.id}`, JSON.stringify(source));
}

function loadSourcesFromLocalStorage() {
	const sources: Source[] = [];
	const keys = Object.keys(localStorage).filter((key) => key.startsWith('source-'));

	keys.forEach((key) => {
		const source = localStorage.getItem(key);
		if (source) {
			sources.push(JSON.parse(source));
		}
	});

	return sources;
}

function deleteSourceFromLocalStorage(id: string) {
	if (!id) return;

	localStorage.removeItem(id);
}
