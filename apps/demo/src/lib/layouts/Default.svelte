<script lang="ts">
	interface Props {
		title?: string | null;
		children?: import('svelte').Snippet;
	}

	let { title = null, children }: Props = $props();
</script>

<svelte:head>
	<title>{title ? `${title} | ` : ''}svelte-markdoc-preprocess</title>
	<meta
		name="description"
		content="A Svelte preprocessor that brings the power of Markdoc right into your Svelte applications!"
	/>
</svelte:head>
{@render children?.()}
