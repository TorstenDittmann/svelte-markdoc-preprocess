<script>
    export let data;
</script>

{#each data.files as file}
    <section>
        <h3>{file.filepath}</h3>
        {#if file.frontmatter}
            <p>{JSON.stringify(file.frontmatter)}</p>
        {/if}
    </section>
{/each}
