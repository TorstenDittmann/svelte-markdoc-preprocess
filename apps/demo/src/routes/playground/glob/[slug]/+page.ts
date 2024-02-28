import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const post = await import(`../${params.slug}.markdoc`);

        return {
            content: post.default,
            frontmatter: post.frontmatter,
        };
    } catch (e) {
        error(404, `Could not find ${params.slug}`);
    }
}
