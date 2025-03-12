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
        this.saveToLocalStorage('sources', this.state.list);
        this.saveToLocalStorage('pinned', this.state.pinned);
        this.saveToLocalStorage('columns', this.state.columns);
    }

    private loadColumnsFromLocalStorage(): number {
        const columns = this.loadFromLocalStorage('columns') as number;
        return columns ? columns : 1;
    }

    private loadSourcesFromLocalStorage(): Source[] {
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

    private loadPinnedSourcesFromLocalStorage(): Source[] {
        const pinnedSources: Source[] = [];
        const keys = Object.keys(localStorage).filter((key) => key.startsWith('pinned-source-'));
        keys.forEach((key) => {
            const source = localStorage.getItem(key);
            if (source) {
                pinnedSources.push(JSON.parse(source));
            }
        });
        return pinnedSources;
    }

    private saveToLocalStorage(key: string, value: SourceState['list'] | SourceState['pinned'] | number): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private loadFromLocalStorage(key: string): SourceState['list'] | SourceState['pinned'] | number {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : [];
    }

    private deleteSourceFromLocalStorage(id: string): void {
        if (!id) return;
        localStorage.removeItem(id);
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