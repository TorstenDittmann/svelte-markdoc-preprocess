<script lang="ts">
	import { page } from '$app/stores';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let is_expanded = $state(false);

	let links = $derived([
		{
			path: '/documentation',
			name: 'Install',
			is_selected: $page.url.pathname === '/documentation'
		},
		{
			path: '/documentation/configuration',
			name: 'Configuration',
			is_selected: $page.url.pathname === '/documentation/configuration'
		},
		{
			path: '/documentation/nodes',
			name: 'Nodes',
			is_selected: $page.url.pathname === '/documentation/nodes'
		},
		{
			path: '/documentation/tags',
			name: 'Tags',
			is_selected: $page.url.pathname === '/documentation/tags'
		},
		{
			path: '/documentation/layouts',
			name: 'Layouts',
			is_selected: $page.url.pathname === '/documentation/layouts'
		},
		{
			path: '/documentation/partials',
			name: 'Partials',
			is_selected: $page.url.pathname === '/documentation/partials'
		},
		{
			path: '/documentation/advanced',
			name: 'Advanced',
			is_selected: $page.url.pathname === '/documentation/advanced'
		}
	]);
</script>

<div class="row">
	<aside class="col-3">
		<nav
			class="p-side-navigation--raw-html is-sticky"
			class:is-drawer-collapsed={!is_expanded}
			class:is-drawer-expanded={is_expanded}
			id="drawer"
			aria-label="Table of contents"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<span
				onclick={() => (is_expanded = !is_expanded)}
				role="button"
				tabindex="0"
				class="p-side-navigation__toggle"
				aria-controls="drawer"
				aria-expanded={is_expanded ? 'true' : 'false'}
			>
				Toggle side navigation
			</span>

			<div
				class="p-side-navigation__overlay"
				aria-controls="drawer"
				aria-expanded={is_expanded ? 'true' : 'false'}
			></div>

			<div class="p-side-navigation__drawer">
				<div class="p-side-navigation__drawer-header">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<span
						onclick={() => (is_expanded = !is_expanded)}
						role="button"
						tabindex="0"
						class="p-side-navigation__toggle--in-drawer"
						aria-controls="drawer"
						aria-expanded={is_expanded ? 'true' : 'false'}
					>
						Toggle side navigation
					</span>
				</div>
				<h3>Side navigation</h3>
				<ul>
					{#each links as link (link.path)}
						<li aria-current={link.is_selected ? 'page' : null}>
							<a class:is-active={link.is_selected} href={link.path}>{link.name}</a>
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	</aside>

	<main class="col-9" id="main-content">
		{@render children?.()}
	</main>
</div>
