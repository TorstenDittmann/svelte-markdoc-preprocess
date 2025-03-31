<script lang="ts">
	interface Props {
		layout: string;
		children?: import('svelte').Snippet;
	}

	let { layout, children }: Props = $props();
</script>

<h1>I am on an {layout} layout</h1>
{@render children?.()}
