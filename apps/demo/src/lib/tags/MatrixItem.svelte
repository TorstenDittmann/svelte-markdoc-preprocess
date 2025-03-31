<script lang="ts">
	interface Props {
		title: string;
		children?: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();
</script>

<li class="p-matrix__item">
	<div class="p-matrix__content">
		<h3 class="p-matrix__title">{title}</h3>
		<div class="p-matrix__desc">
			{@render children?.()}
		</div>
	</div>
</li>
