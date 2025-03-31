<script lang="ts">
	interface Props {
		a: number;
		b: number;
	}

	let { a, b }: Props = $props();
</script>

<b>Multiply</b>
<p>
	<b>{a}</b> * <b>{b}</b> = <b>{a * b}</b>
</p>
