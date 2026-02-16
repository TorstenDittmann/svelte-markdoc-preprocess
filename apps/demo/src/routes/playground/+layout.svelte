<script lang="ts">
	import { resolve } from '$app/paths';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav>
	<a href={resolve('/playground/tags')}>tags</a> |
	<a href={resolve('/playground/partials')}>partials</a> |
	<a href={resolve('/playground/layout')}>layout</a> |
	<a href={resolve('/playground/glob')}>glob</a> |
	<a href={resolve('/playground/markdown')}>markdown</a>
</nav>

{@render children?.()}
