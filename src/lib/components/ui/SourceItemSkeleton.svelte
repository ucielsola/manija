<script lang="ts">
	let { count = 5 }: { count?: number } = $props();
</script>

<div class="space-y-2 px-3 pt-2">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each Array(count) as _, i (i)}
		<div class="group relative flex w-full items-center gap-3 rounded-md px-3 py-1">
			<button class="flex flex-1 items-center gap-3 text-left" disabled aria-label="Cargando...">
				<div
					class="bg-surface-container-highest h-10 w-10 animate-pulse overflow-hidden rounded"
				></div>
				<div class="flex flex-col gap-2">
					<div class="bg-surface-container-high h-3 w-24 animate-pulse rounded"></div>
					<div class="flex items-center gap-1.5">
						<div class="bg-surface-container-high h-1.5 w-1.5 animate-pulse rounded-full"></div>
						<div class="bg-surface-container-high h-2 w-16 animate-pulse rounded"></div>
					</div>
				</div>
			</button>
		</div>
	{/each}
</div>
