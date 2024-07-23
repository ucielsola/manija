<script>
	import '../app.css';

	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<div class="h-screen w-screen bg-primary p-6 overflow-x-hidden overflow-y-hidden">
	<Toaster />
	<ModeWatcher defaultMode="dark" />
	<slot></slot>
</div>
