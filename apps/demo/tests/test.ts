import { expect, test } from '@playwright/test';

test('tags work', async ({ page }) => {
    await page.goto('http://localhost:4173/playground/tags');

    expect(await page.content()).toContain('Addition');
    expect(await page.content()).toContain('Multiply');
});

test('partials work', async ({ page }) => {
    await page.goto('http://localhost:4173/playground/partials');

    expect(await page.content()).toContain('I am a partial.');
    expect(await page.content()).toContain('I am a nested partial.');
    expect(await page.content()).toContain('I am passed to a variable.');
});

test('named layouts work', async ({ page }) => {
    await page.goto('http://localhost:4173/playground/layout');

    expect(await page.content()).toContain('I am on an alternate layout');
    expect(await page.content()).toContain('And it works!');
});
