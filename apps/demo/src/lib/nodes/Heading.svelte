<script lang="ts">
    export let level: number;

    let tag = `h${level}`;
</script>

<svelte:element this={tag}><slot /></svelte:element>
