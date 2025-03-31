<script lang="ts">
	interface Props {
		string: string;
		number: number;
		boolean: boolean;
	}

	let { string, number, boolean }: Props = $props();
</script>

<b>Types</b>
<p><b>{string}</b> is typeof <b>{typeof string}</b></p>
<p><b>{number}</b> is typeof <b>{typeof number}</b></p>
<p><b>{boolean}</b> is typeof <b>{typeof boolean}</b></p>
