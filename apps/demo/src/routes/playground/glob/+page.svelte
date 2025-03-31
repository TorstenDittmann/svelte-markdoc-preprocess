<script lang="ts">
	let { data } = $props();
</script>

{#each data.files as file}
	<section>
		<h3><a href={`/playground/glob/${file.slug}`}>{file.filepath}</a></h3>
		{#if file.frontmatter}
			<p>{JSON.stringify(file.frontmatter)}</p>
		{/if}
	</section>
{/each}
