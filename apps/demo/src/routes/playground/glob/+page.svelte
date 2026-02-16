<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

{#each data.files as file (file.slug)}
	<section>
		<h3><a href={resolve(`/playground/glob/${file.slug}`)}>{file.filepath}</a></h3>
		{#if file.frontmatter}
			<p>{JSON.stringify(file.frontmatter)}</p>
		{/if}
	</section>
{/each}
