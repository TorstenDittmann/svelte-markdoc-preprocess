import { Node } from '@markdoc/markdoc';

export type Config = {
    extensions: string[];
    nodes: Record<string, Node>;
    layouts: {
        default: string;
        [key: string]: string;
    } | null;
};
