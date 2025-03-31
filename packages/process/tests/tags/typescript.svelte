<script lang="ts">
	type Props = {
		number: number;
		string: string;
		boolean: boolean;
	};

	let {
		number,
		string,
		boolean
	}: Props = $props();
</script>

{number}
{string}
{boolean}
