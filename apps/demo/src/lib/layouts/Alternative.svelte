<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<h1>I am on an alternative layout</h1>
{@render children?.()}
