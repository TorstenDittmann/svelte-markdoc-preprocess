import { Schema } from '@markdoc/markdoc';

export type Config = {
    extensions: string[];
    tags: Record<string, Schema>;
    layout: string | null;
};
