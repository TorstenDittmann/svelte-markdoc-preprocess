<script lang="ts">
	let { data } = $props();
</script>

<h3>{data.frontmatter.title}</h3>

<data.content />
