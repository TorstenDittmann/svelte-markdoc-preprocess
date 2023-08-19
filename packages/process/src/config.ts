import { SvelteComponent } from 'svelte';
import { NodeType } from '@markdoc/markdoc';

export type Config = {
    extensions: string[];
    nodes: string | null;
    tags: string | null;
    generateSchema: boolean;
    layouts: {
        default: string;
        [key: string]: string;
    } | null;
};
