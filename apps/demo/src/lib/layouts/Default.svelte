<script lang="ts">
    export let title: string | null = null;
</script>

<svelte:head>
    <title>{title ? `${title} | ` : ''}svelte-markdoc-preprocess</title>
    <meta
        name="description"
        content="A Svelte preprocessor that brings the power of Markdoc right into your Svelte applications!"
    />
</svelte:head>
<slot />
