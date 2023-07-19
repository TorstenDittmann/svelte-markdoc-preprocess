import adapter from "@sveltejs/adapter-auto";
import markdoc from "./src/lib/processor.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
        alias: {
            $test: "./src/test"
        }
    },
    preprocess: [
        markdoc({
            layout: join(dirname(fileURLToPath(import.meta.url)), "./src/test/Layout.svelte"),
            tags: {
                mytest: {
                    render: "Test",
                    selfClosing: true
                },
                addition: {
                    render: "Addition",
                    attributes: {
                        a: {
                            type: Number
                        },
                        b: {
                            type: Number
                        }
                    }
                }
            }
        })
    ],
    extensions: [".markdoc", ".svelte"]
};

export default config;
