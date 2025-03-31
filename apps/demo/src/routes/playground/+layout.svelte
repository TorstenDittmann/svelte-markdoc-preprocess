<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav>
	<a href="/playground/tags">tags</a> |
	<a href="/playground/partials">partials</a> |
	<a href="/playground/layout">layout</a> |
	<a href="/playground/glob">glob</a> |
	<a href="/playground/markdown">markdown</a>
</nav>

{@render children?.()}
