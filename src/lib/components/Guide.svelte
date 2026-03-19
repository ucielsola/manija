<script lang="ts">
	import { Tv } from '$lib/components/icons';
</script>

<div class="flex h-full grow flex-col items-center justify-center gap-4">
    <div class="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-dashed border-base-content/20 bg-base-200/30 px-8 py-10 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-4">
            <div class="h-16 w-16 text-base-content/50">
                <Tv />
            </div>
            <span class="text-base-content text-xl font-semibold text-center">Bienvenido a Manija TV!</span>
        </div>
        <div class="flex flex-col gap-3">
            <span class="text-base-content/80 text-center text-sm leading-relaxed">
                Agregá todos los videos de YouTube que quieras ver en simultáneo.
            </span>
            <span class="text-base-content/80 text-center text-sm leading-relaxed">
                Podés fijar videos y configurar la cantidad de columnas.
            </span>
        </div>
    </div>
</div>