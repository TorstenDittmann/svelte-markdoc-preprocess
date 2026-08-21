import { defineConfig } from 'vitest/config';

const ONE_MINUTE = 1000 * 60;

export default defineConfig({
    test: {
        include: ['tests/**/*.test.{js,ts}'],
        exclude: ['tests/setup/*'],
        testTimeout: ONE_MINUTE * 3,
        hookTimeout: ONE_MINUTE * 3,
        globalSetup: ['tests/setup/global.js'],
        // the test harness installs with pnpm; if pnpm is a corepack shim it would
        // otherwise refuse the `packageManager: bun@...` declared in the workspace root
        env: { COREPACK_ENABLE_PROJECT_SPEC: '0' },
        expect: {
            requireAssertions: true,
        },
    },
});
