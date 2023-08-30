import { parse } from 'path';

export function load() {
    const modules = import.meta.glob('./*.markdoc', {
        eager: true,
    });

    const files = Object.entries(modules).map(([filepath, module]) => {
        const { frontmatter } = module as Record<string, Record<string, string>>;
        return {
            slug: parse(filepath).name,
            filepath,
            frontmatter,
        };
    });

    return {
        files,
    };
}
