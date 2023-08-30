<script lang="ts">
    export let data;
</script>

<h3>{data.frontmatter.title}</h3>

<svelte:component this={data.content} />
