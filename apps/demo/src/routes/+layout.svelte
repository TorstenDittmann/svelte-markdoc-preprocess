<script>
    import { dev } from "$app/environment";
</script>

<header>
    <nav>
        <h1>svelte-markdoc-preprocess</h1>
        <a href="/">home</a> |
        <a href="/install">install</a> |
        <a href="/nodes">nodes</a> |
        <a href="/tags">tags</a> |
        <a href="/layouts">layouts</a> |
        <a href="/advanced">advanced</a> |
        <a target="_blank" href="https://github.com/TorstenDittmann/svelte-markdoc-preprocess">github</a>
		{#if dev}
			| <a href="/playground">playground</a>
		{/if}
    </nav>
</header>

<main>
    <slot />
</main>
