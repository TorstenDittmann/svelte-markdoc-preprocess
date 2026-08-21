import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import addon from '../src/index.js';
import { setupTest } from './setup/suite.js';

const preprocessorPackage = JSON.parse(
    fs.readFileSync(
        new URL('../../process/package.json', import.meta.url),
        'utf8',
    ),
);

const { test, testCases } = setupTest(
    { addon },
    {
        kinds: [{ type: 'default', options: { [addon.id]: {} } }],
        browser: false,
    },
);

/** The svelte/kit config lives in `svelte.config.js` or, for newer templates, inside `vite.config.{js,ts}`. */
function readConfig(cwd) {
    for (const file of [
        'svelte.config.js',
        'svelte.config.ts',
        'vite.config.js',
        'vite.config.ts',
    ]) {
        const file_path = path.resolve(cwd, file);
        if (!fs.existsSync(file_path)) continue;
        const content = fs.readFileSync(file_path, 'utf8');
        if (content.includes('markdoc')) return content;
    }
    throw new Error(`no config containing markdoc found in ${cwd}`);
}

test.concurrent.for(testCases)(
    'markdoc $kind.type $variant',
    async (testCase, ctx) => {
        const cwd = ctx.cwd(testCase);

        const config = readConfig(cwd);
        expect(config).toContain(
            "import { markdoc } from 'svelte-markdoc-preprocess';",
        );
        expect(config).toContain('markdoc()');
        expect(config).toContain("'.markdoc'");
        expect(config).toContain("'.svelte'");

        const pkg = JSON.parse(
            fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'),
        );
        expect(pkg.devDependencies['svelte-markdoc-preprocess']).toBe(
            `^${preprocessorPackage.version}`,
        );
    },
);
