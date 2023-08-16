<script>
    import { dev } from "$app/environment";
</script>

<header>
    <nav>
        <h1>svelte-markdoc-preprocess</h1>
        <a href="/">home</a> /
        <a href="/docs">docs</a>
        <a target="_blank" href="https://github.com/TorstenDittmann/svelte-markdoc-preprocess">github</a>
		{#if dev}
			/ <a href="/playground">playground</a>
		{/if}
    </nav>
</header>

<main>
    <slot />
</main>
