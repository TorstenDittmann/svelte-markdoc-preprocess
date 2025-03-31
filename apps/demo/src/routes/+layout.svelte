<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let links = $derived([
		{
			path: '/',
			name: 'Home',
			is_selected: $page.url.pathname === '/'
		},
		{
			path: '/documentation',
			name: 'Documentation',
			is_selected: $page.url.pathname.startsWith('/documentation')
		},
		...(dev
			? [
					{
						path: '/playground',
						name: 'Playground',
						is_selected: $page.url.pathname.startsWith('/playground')
					}
				]
			: [])
	]);
</script>

<header id="navigation" class="p-navigation is-dark">
	<div class="p-navigation__row">
		<div class="p-navigation__banner">
			<div class="p-navigation__tagged-logo">
				<a class="p-navigation__link" href="/">
					<span class="p-navigation__logo-title">svelte-markdoc-preprocess</span>
				</a>
			</div>
			<a href="#navigation" class="p-navigation__toggle--open" title="menu">Menu</a>
			<a href="#navigation-closed" class="p-navigation__toggle--close" title="close menu"
				>Close menu</a
			>
		</div>
		<nav class="p-navigation__nav" aria-label="Navigation">
			<ul class="p-navigation__items">
				{#each links as link}
					<li
						class="p-navigation__item"
						class:is-selected={link.is_selected}
						aria-current={link.is_selected ? 'page' : null}
					>
						<a class="p-navigation__link" href={link.path}>{link.name}</a>
					</li>
				{/each}
				<li class="p-navigation__item">
					<a
						class="p-navigation__link"
						target="_blank"
						href="https://github.com/TorstenDittmann/svelte-markdoc-preprocess">GitHub</a
					>
				</li>
			</ul>
		</nav>
	</div>
</header>

<main class="p-strip is-shallow">
	<div class="row">
		{@render children?.()}
	</div>
</main>
