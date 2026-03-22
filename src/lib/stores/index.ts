import { UserSources } from '$lib/models/userSources.svelte';
import { ManijaSources } from '$lib/models/manijaSources.svelte';
import { ToastStore } from '$lib/models/toasts.svelte';
import { App } from '$lib/models/app.svelte';

export const app = new App();
export const userSources = new UserSources();
export const manijaSources = new ManijaSources();
export const toastStore = new ToastStore();
