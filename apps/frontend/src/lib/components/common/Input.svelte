<script lang="ts">
	type InputProps = {
		label: string;
		labelledby: string;
		id?: string;
		type: string;
		placeholder: string;
		value: string;
	};

	let { label, labelledby, id, type, placeholder, value = $bindable('') }: InputProps = $props();
</script>


<fieldset class="fieldset">
	<legend class="fieldset-legend">{label}</legend>
	<input {type} {placeholder} bind:value aria-labelledby={labelledby} class="input" />
</fieldset>
