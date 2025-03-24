<script lang="ts">
	import { app, sourceList } from '$lib/stores';
	import { Check } from '$lib/components/icons';

	let open = $state(false);
	let pinnedSources = $derived(sourceList.pinned);
	let columnOptions = $derived(pinnedSources.map((s, index) => index + 1));
	let selectedColumn = $derived(app.columns);

	const handleSelect = (option: number) => {
		app.columns = option;
		open = false;
	};
</script>

<div class="relative -top-1 left-0 z-100">
	<div class=" absolute z-100 ">
		<ul class="menu rounded-box p-[2px]">
			<li class="bg-base-100 border border-primary rounded-box">
				<details bind:open={open}>
					<summary>Columnas</summary>
					<ul>
						{#each columnOptions as option}
							<li>
								<button class="w-24 flex justify-between" onclick={() => handleSelect(option)}>
									<span class="text-slate-900 dark:text-slate-200">
										{option}
									</span>
									{#if option === selectedColumn}
										<Check className="w-4 h-4" />
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				</details>
			</li>
		</ul>
	</div>
</div>
