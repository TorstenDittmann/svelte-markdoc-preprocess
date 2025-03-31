<script lang="ts">
	interface Props {
		level: number;
		children?: import('svelte').Snippet;
	}

	let { level, children }: Props = $props();

	let tag = `h${level}`;
</script>

<svelte:element this={tag}>{@render children?.()}</svelte:element>
