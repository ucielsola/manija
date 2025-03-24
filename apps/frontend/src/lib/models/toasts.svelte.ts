import type { Toast } from "$lib/types/Toast";

export class ToastStore {
    private static DurationMS = 5000;
    private toasts = $state<Toast[]>([])

    get presenting() {
        return this.toasts;
    }

    addToast(toast: Omit<Toast, 'id'>): void {
        const id = `${new Date().getTime()}`
        this.toasts.push({ ...toast, id });
        this.scheduleClear(id);
    }

    private scheduleClear(id: string) {
        setTimeout(() => {
            this.toasts = this.toasts.filter((toast) => toast.id !== id);
        }, ToastStore.DurationMS);
    }
}
