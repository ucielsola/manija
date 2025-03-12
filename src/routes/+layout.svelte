<script>
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
</script>

<div class="bg-primary h-screen w-screen overflow-x-hidden overflow-y-hidden">
	<Toaster />
	<slot></slot>
</div>
