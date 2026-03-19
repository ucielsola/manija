<script lang="ts">
	import { Refresh, Tv } from '$lib/components/icons';
	import ColumnAmountSelector from '$lib/components/ColumnAmountSelector.svelte';
	import { app, sourceList } from '$lib/stores';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import SoundOff from './icons/SoundOff.svelte';
</script>

<div class="navbar  bg-base-100 shadow-sm border-b px-4">
	<div class="flex-1">
		<div class="text-primary-foreground flex items-center gap-4">
			<div class="h-12 w-12 text-primary">
				<Tv />
			</div>
			<div class="flex items-center gap-8">
				<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
					Manija TV
				</h1>
				<span class="text-xs font-medium">
					Agregá todos los videos de
					<a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"> YouTube </a>
					que quieras para verlos en simultáneo.
				</span>
			</div>
		</div>
	</div>
	<div class="flex-none flex items-center gap-4">
		<div class="relative w-28 h-8 z-100">
			<ColumnAmountSelector />
		</div>

		<button class="btn btn-outline btn-error btn-sm" onclick={() => sourceList.muteAll()}>
				<SoundOff className="w-4 h-4" />
				Mutear
		</button>

		<button class="btn btn-outline btn-error btn-sm" disabled={sourceList.sources.length === 0} onclick={() => app.showDeleteAll = true}>
			<Refresh className="w-4 h-4" />
			Reiniciar
		</button>

		<ThemeSwitcher />
	</div>
</div>
