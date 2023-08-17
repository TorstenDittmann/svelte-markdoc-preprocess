import { Node, NodeType } from '@markdoc/markdoc';

export type Config = {
    extensions: string[];
    nodes: Record<NodeType, Node>;
    layouts: {
        default: string;
        [key: string]: string;
    } | null;
};
