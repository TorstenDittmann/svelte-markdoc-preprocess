<script lang="ts">
    import 'highlight.js/styles/github-dark.css';
    import hljs from 'highlight.js';

    export let content: string;
    export let language: string;

    const result = hljs.highlight(content, { language: language ?? 'shell' });
</script>

<pre><code class={`language-${language}`}>{@html result.value}</code></pre>
