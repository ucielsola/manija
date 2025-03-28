<script lang="ts">
	type InputProps = {
		label: string;
		labelledby: string;
		id?: string;
		type: string;
		placeholder: string;
		value: string;
		autoFocus?: boolean;
	};

	let { label, labelledby, id, type, placeholder, value = $bindable(''), autoFocus }: InputProps = $props();
	let inputEl: HTMLInputElement;

	$effect(() => {
		if (autoFocus) {
			inputEl.focus();
		}
	});
</script>


<fieldset class="fieldset">
	<legend class="fieldset-legend">{label}</legend>
	<input {id} {type} {placeholder} bind:value aria-labelledby={labelledby} class="input" bind:this={inputEl} />
</fieldset>
