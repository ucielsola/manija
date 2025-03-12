import type { Source } from '$lib/types/Source';

interface SourceState {
    loaded: boolean;
    list: Source[];
    pinned: Source[];
    columns: number;
    isDeleting: boolean;
    deleteSuccess: boolean;
}

class SourceStore {
    private state = $state<SourceState>({
        loaded: false,
        list: [],
        pinned: [],
        columns: 1,
        isDeleting: false,
        deleteSuccess: false
    });

    recoverState(): void {
        console.log({list: this.loadSourcesFromLocalStorage(),
            pinned: this.loadPinnedSourcesFromLocalStorage(),
            columns: this.loadColumnsFromLocalStorage()}
        )
        this.state = {
            ...this.state,
            list: this.loadSourcesFromLocalStorage(),
            pinned: this.loadPinnedSourcesFromLocalStorage(),
            columns: this.loadColumnsFromLocalStorage(),
            loaded: true
        }
    }

    addSource(source: Source): void {
        if (!source) return;

        this.state = {
            ...this.state,
            list: [...this.state.list, source]
        }

        this.saveStateToLocalStorage();
    }

    deleteSource(id: string, onSuccess?: () => void): void {
        if (!id || !this.state.list?.length) return;
        this.state = {
            ...this.state,
            list: this.state.list.filter((source) => source.id !== id),
            pinned: this.state.pinned.filter((source) => source.id !== id),
            deleteSuccess: true
        };
        this.deleteSourceFromLocalStorage(id);
        onSuccess?.();
    }

    deleteAllSources(): void {
        this.state = {
            ...this.state,
            list: [],
            pinned: []
        };
    }

    setColumns(columns: number): void {
        this.state = {
            ...this.state,
            columns: columns
        };
        this.saveStateToLocalStorage();
    }

    toggleDeleteMode(): void {
        this.state = {
            ...this.state,
            isDeleting: !this.state.isDeleting
        };
    }

    pinSource(source: Source): void {
        console.log(this.state)
        if (!source) return;
        this.state = {
            ...this.state,
            pinned: [...this.state.pinned, source]
        };

        this.saveStateToLocalStorage();
    }

    unpinSource(source: Source): void {
        console.log(this.state)

        if (!source) return;
        this.state = {
            ...this.state,
            pinned: this.state.pinned.filter((pinned) => pinned.id !== source.id)
        };
        this.saveStateToLocalStorage();
    }

    private saveStateToLocalStorage(): void {
        try {
            // Save sources as a single array
            localStorage.setItem('sources', JSON.stringify(this.state.list));
            
            // Save pinned sources as a single array
            localStorage.setItem('pinned-sources', JSON.stringify(this.state.pinned));
            
            // Save columns
            localStorage.setItem('columns', this.state.columns.toString());
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    private loadColumnsFromLocalStorage(): number {
        try {
            const columns = localStorage.getItem('columns');
            return columns ? parseInt(columns, 10) : 1;
        } catch (error) {
            console.error('Error loading columns:', error);
            return 1;
        }
    }

    private loadSourcesFromLocalStorage(): Source[] {
        try {
            const sourcesJson = localStorage.getItem('sources');
            return sourcesJson ? JSON.parse(sourcesJson) : [];
        } catch (error) {
            console.error('Error loading sources:', error);
            return [];
        }
    }

    private loadPinnedSourcesFromLocalStorage(): Source[] {
        try {
            const pinnedJson = localStorage.getItem('pinned-sources');
            return pinnedJson ? JSON.parse(pinnedJson) : [];
        } catch (error) {
            console.error('Error loading pinned sources:', error);
            return [];
        }
    }

    private deleteSourceFromLocalStorage(id: string): void {
        if (!id) return;
        try {
            // Load current arrays
            const sources = this.loadSourcesFromLocalStorage();
            const pinnedSources = this.loadPinnedSourcesFromLocalStorage();

            // Filter out the deleted source
            const updatedSources = sources.filter(source => source.id !== id);
            const updatedPinnedSources = pinnedSources.filter(source => source.id !== id);

            // Save updated arrays
            localStorage.setItem('sources', JSON.stringify(updatedSources));
            localStorage.setItem('pinned-sources', JSON.stringify(updatedPinnedSources));
        } catch (error) {
            console.error('Error deleting source:', error);
        }
    }

    get sources(): Source[] {
        return this.state.list;
    }

    get pinnedSources(): Source[] {
        return this.state.pinned;
    }

    get isLoaded(): boolean {
        return this.state.loaded;
    }

    get columns(): number {
        return this.state.columns;
    }

    get isDeleting(): boolean {
        return this.state.isDeleting;
    }

    get deleteSuccess(): boolean {
        return this.state.deleteSuccess;
    }
}

export const sourceStore = new SourceStore();