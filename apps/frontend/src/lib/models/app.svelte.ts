import { AppStorage, type StorageProvider } from "$lib/models/appStorage";

export class App implements StorageProvider {
    storage?: AppStorage;
    private _showIntro = $state<boolean>(true);
    private _theme = $state<'light' | 'dark'>('light');
    private _columns = $state<number>(1);
    private _sideBarCollapsed = $state<boolean>(true);
    private _showAddSource = $state<boolean>(false);
    private _showDeleteAll = $state<boolean>(false);
    private _renamingSourceId = $state<string | null>(null);
    private _hasClipboardAccess = $state<boolean>(false);

    public initStorage(): void {
        if (this.storage) {
            console.warn("Storage is already initialized.");
            return;
        }

        this.storage = new AppStorage();
        this._theme = this.storage.get<'light' | 'dark'>('theme') ?? 'light';
        this._columns = this.storage.get<number>('columns') ?? 1;
    }

    get hasClipboardAccess(): boolean {
        return this._hasClipboardAccess;
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

    get renamingSourceId(): string | null {
        return this._renamingSourceId;
    }

    set renamingSourceId(value: string | null) {
        this._renamingSourceId = value;
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
        document.cookie = `manija-tv-theme=${value}; path=/; max-age=31536000`;
    }

    get showIntro(): boolean {
        return this._showIntro;
    }

    set showIntro(show: boolean) {
        this._showIntro = show
    }

    async checkClipboardAccess() {
        if (this._hasClipboardAccess) {
            this._showIntro = false;
            return;
        }

        if (typeof navigator === 'undefined') {
            console.error("NO NAVI!")
            return;
        }

        const permission = await navigator.permissions.query({ name: 'clipboard-read' })

        this._hasClipboardAccess = permission?.state === 'granted';
    }

    toggleSidebar(): void {
        this._sideBarCollapsed = !this._sideBarCollapsed;
    }

    checkStorage(): void {
        if (!this.storage) {
            throw new Error("Storage has not been initialized. Call initStorage() first.");
        }
    }

    dismissOpenDialogs(): void {
        if (!this._showAddSource && !this._showDeleteAll && !this._renamingSourceId) {
            this.toggleSidebar();
        } else {
            this._showAddSource = false;
            this._showDeleteAll = false;
            this._renamingSourceId = null;
        }

    }
}
