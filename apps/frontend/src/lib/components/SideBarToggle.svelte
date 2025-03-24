<script lang="ts">
	import { ChevronLeft } from '$lib/components/icons';

	import { app } from '$lib/stores';

	let isCollapsed = $derived(app.sideBarCollapsed);
    let left = $derived(isCollapsed ? "left-0" : "left-[14rem]")
</script>

<button
	onclick={() => app.toggleSidebar()}
	class={`absolute z-50 flex items-center justify-center top-1 w-8 h-8 transition-all duration-300 cursor-pointer ${left}`}
>
	<ChevronLeft className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
</button>
