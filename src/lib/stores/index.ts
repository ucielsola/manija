import { SourceList } from "$lib/models/sourceList.svelte";
import { ToastStore } from "$lib/models/toasts.svelte";
import { App } from "$lib/models/app.svelte";

export const app = new App();
export const sourceList = new SourceList();
export const toastStore = new ToastStore();