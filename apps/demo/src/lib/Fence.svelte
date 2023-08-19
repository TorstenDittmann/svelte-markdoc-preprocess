<script lang="ts">
    import 'highlight.js/styles/github-dark.css';
    import hljs from 'highlight.js';

    export let content: string;
    export let language: string;

    const result = hljs.highlight(content, { language: language ?? 'shell' });
</script>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<pre><code class={`language-${language}`}>{@html result.value}</code></pre>
