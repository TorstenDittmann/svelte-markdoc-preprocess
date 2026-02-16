<script lang="ts">
	import { resolve } from '$app/paths';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div id="main-content" class="p-strip">
	<div class="l-main">
		<div class="u-fixed-width">
			<h1>svelte-markdoc-preprocess</h1>
			{@render children?.()}
			<ul class="p-inline-list u-no-margin--bottom">
				<li class="p-inline-list__item">
					<a href={resolve('/documentation')} class="p-button--positive u-no-margin--bottom"
						>Get started</a
					>
				</li>
				<li class="p-inline-list__item">
					<a
						href="https://github.com/TorstenDittmann/svelte-markdoc-preprocess"
						class="p-button u-no-margin--bottom">GitHub</a
					>
				</li>
			</ul>
		</div>
	</div>
</div>
