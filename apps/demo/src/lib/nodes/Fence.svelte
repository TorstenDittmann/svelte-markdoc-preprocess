<script lang="ts">
    import 'highlight.js/styles/github-dark.css';
    import hljs from 'highlight.js/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    import xml from 'highlight.js/lib/languages/xml';
    import shell from 'highlight.js/lib/languages/shell';
    import markdown from 'highlight.js/lib/languages/markdown';
    import json from 'highlight.js/lib/languages/json';

    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('sh', shell);
    hljs.registerLanguage('md', markdown);
    hljs.registerLanguage('json', json);

    export let content: string;
    export let language: string;
    export let process: boolean;

    const result = process ? hljs.highlight(content, { language: language ?? 'sh' }) : { value: content };
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<pre><code class={`language-${language}`}>{@html result.value}</code></pre>
