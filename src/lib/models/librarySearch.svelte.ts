import { userSources, manijaSources } from '$lib/stores';

export class LibrarySearch {
	private _searchTerm = $state<string>('');

	get searchTerm(): string {
		return this._searchTerm;
	}

	set searchTerm(value: string) {
		this._searchTerm = value;
	}

	get allSources() {
		return [...manijaSources.sources, ...userSources.sources];
	}

	get filteredSources() {
		if (!this._searchTerm.trim()) {
			return this.allSources;
		}

		const searchTermLower = this._searchTerm.toLowerCase();
		return this.allSources.filter((source) => source.name.toLowerCase().includes(searchTermLower));
	}

	get hasSearch(): boolean {
		return this._searchTerm.trim().length > 0;
	}

	clearSearch(): void {
		this._searchTerm = '';
	}
}
