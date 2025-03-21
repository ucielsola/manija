import { AppStorage, type StorageProvider } from "$lib/models/appStorage";

export class App implements StorageProvider {
    storage?: AppStorage;
    private _loaded = $state<boolean>(false);
    private _theme = $state<'light' | 'dark'>('light');
    private _columns = $state<number>(1);
    private _sideBarCollapsed = $state<boolean>(false);
    private _showAddSource = $state<boolean>(false);
    private _showDeleteAll = $state<boolean>(false);

    public initStorage(): void {
        if (this.storage) {
            console.warn("Storage is already initialized.");
            return;
        }

        this.storage = new AppStorage();
        this._loaded = true;

        this._theme = this.storage.get<'light' | 'dark'>('theme') ?? 'light';
        this._columns = this.storage.get<number>('columns') ?? 1;
    }

    get showAddSource(): boolean {
        return this._showAddSource;
    }

    set showAddSource(value: boolean) {
        this._showAddSource = value;
    }

    get showDeleteAll(): boolean {
        return this._showDeleteAll;
    }

    set showDeleteAll(value: boolean) {
        this._showDeleteAll = value;
    }

    get columns(): number {
        return this._columns;
    }

    set columns(value: number) {
        this._columns = value;
        this.storage!.set('columns', value);
    }

    get sideBarCollapsed(): boolean {
        return this._sideBarCollapsed;
    }

    get theme(): 'light' | 'dark' {
        return this._theme;
    }

    set theme(value: 'light' | 'dark') {
        this._theme = value;
        this.storage!.set('theme', value);
    }

    get loaded(): boolean {
        return this._loaded;
    }

    toggleSidebar(): void {
        this._sideBarCollapsed = !this._sideBarCollapsed;
    }

    checkStorage(): void {
        if (!this.storage) {
            throw new Error("Storage has not been initialized. Call initStorage() first.");
        }
    }
}
