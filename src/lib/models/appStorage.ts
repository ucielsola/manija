export interface StorageProvider {
    storage?: AppStorage;
    initStorage(): void;
    checkStorage(): void;
}

export class AppStorage {
    private static StoragePrefix = 'manija-tv-';

    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(AppStorage.StoragePrefix + key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting key "${key}" in localStorage:`, error);
        }
    }

    get<T>(key: string): T | undefined {
        try {
            const item = localStorage.getItem(AppStorage.StoragePrefix + key);
            return item ? (JSON.parse(item) as T) : undefined;
        } catch (error) {
            console.error(`Error getting key "${key}" from localStorage:`, error);
            return undefined;
        }
    }

    delete(key: string): void {
        try {
            localStorage.removeItem(AppStorage.StoragePrefix + key);
        } catch (error) {
            console.error(`Error deleting key "${key}" from localStorage:`, error);
        }
    }
}