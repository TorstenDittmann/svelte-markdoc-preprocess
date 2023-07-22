import test from 'ava';
import { transformer } from './transformer.js';

test('can parse markdoc', (t) => {
    t.is(
        transformer({
            content: '# Hello World',
            tags: {},
            layout: null,
        }),
        '<article><h1>Hello World</h1></article>',
    );
});

test('can add layout', (t) => {
    t.is(
        transformer({
            content: 'Lorem Ipsum',
            tags: {},
            layout: './some/layout.svelte',
        }),
        "<script>import INTERNAL__LAYOUT from './some/layout.svelte';import {} from './some/layout.svelte';</script><INTERNAL__LAYOUT><article><p>Lorem Ipsum</p></article></INTERNAL__LAYOUT>",
    );
});
