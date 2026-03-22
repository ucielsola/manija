<script lang="ts">
	let {
		title,
		thumbnail,
		isLive = true
	}: { title: string; thumbnail: string; isLive?: boolean } = $props();
</script>

<div class="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-1 hover:bg-white/5">
	<div class="bg-surface-container-highest h-10 w-10 overflow-hidden rounded">
		<img
			src={thumbnail}
			alt={title}
			class="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
		/>
	</div>
	<div class="flex flex-col">
		<span class="text-on-surface text-xs font-bold">{title}</span>
		{#if isLive}
			<div class="flex items-center gap-1.5">
				<span class="bg-tertiary h-1.5 w-1.5 rounded-full"></span>
				<span class="text-[9px] text-neutral-500 uppercase">En Vivo Ahora</span>
			</div>
		{/if}
	</div>
</div>
