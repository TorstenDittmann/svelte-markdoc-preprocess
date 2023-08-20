<script>
    import { dev } from '$app/environment';
</script>

<svelte:head>
    <title>svelte-markdoc-preprocess</title>
    <meta
        name="description"
        content="A Svelte preprocessor that brings the power of Markdoc right into your Svelte applications!"
    />
</svelte:head>

<header>
    <nav>
        <h1>svelte-markdoc-preprocess</h1>
        <a href="/">home</a> |
        <a href="/install">install</a> |
        <a href="/nodes">nodes</a> |
        <a href="/tags">tags</a> |
        <a href="/layouts">layouts</a> |
        <a href="/partials">partials</a> |
        <a href="/advanced">advanced</a> |
        {#if dev}
            <a href="/playground">playground</a> |
        {/if}
        <a target="_blank" href="https://github.com/TorstenDittmann/svelte-markdoc-preprocess">
            github
        </a>
    </nav>
</header>

<main>
    <slot />
</main>
