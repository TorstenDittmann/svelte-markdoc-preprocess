import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { add } from 'sv';
import { expect, test } from 'vitest';
import addon from '../src/index.js';

const preprocessorPackage = JSON.parse(
    fs.readFileSync(
        new URL('../../process/package.json', import.meta.url),
        'utf8',
    ),
);

const testCases = [
    { variant: 'kit-js', isKit: true, language: 'js' },
    { variant: 'kit-ts', isKit: true, language: 'ts' },
    { variant: 'vite-js', isKit: false, language: 'js' },
    { variant: 'vite-ts', isKit: false, language: 'ts' },
];

function createProject({ variant, isKit, language }) {
    const cwd = fs.mkdtempSync(
        path.join(os.tmpdir(), `sv-markdoc-${variant}-`),
    );
    const packageJson = {
        name: variant,
        private: true,
        type: 'module',
        devDependencies: {
            svelte: '^5.0.0',
            ...(isKit ? { '@sveltejs/kit': '^2.0.0' } : {}),
        },
    };

    fs.writeFileSync(
        path.resolve(cwd, 'package.json'),
        `${JSON.stringify(packageJson, null, 4)}\n`,
    );
    fs.writeFileSync(
        path.resolve(
            cwd,
            language === 'ts' ? 'tsconfig.json' : 'jsconfig.json',
        ),
        '{}\n',
    );

    if (isKit) {
        fs.writeFileSync(
            path.resolve(cwd, `vite.config.${language}`),
            "import { sveltekit } from '@sveltejs/kit/vite';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({ plugins: [sveltekit({})] });\n",
        );
    } else {
        fs.writeFileSync(
            path.resolve(cwd, 'svelte.config.js'),
            "import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';\n\nexport default { preprocess: vitePreprocess() };\n",
        );
    }

    return cwd;
}

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

test.concurrent.for(testCases)('markdoc $variant', async (testCase) => {
    const cwd = createProject(testCase);

    try {
        const result = await add({
            addons: { addon },
            cwd,
            options: { [addon.id]: {} },
            packageManager: 'bun',
        });
        const config = readConfig(cwd);
        expect(result.status[addon.id]).toBe('success');
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
    } finally {
        fs.rmSync(cwd, { recursive: true, force: true });
    }
});
