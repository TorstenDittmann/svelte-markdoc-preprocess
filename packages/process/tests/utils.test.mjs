import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    relative_posix_path,
    read_file,
    get_all_files,
    path_exists,
    write_to_file,
} from '../dist/utils.js';

test('relative_posix_path', async () => {
    assert.equal(
        relative_posix_path('/test/a/b/c', '/test/file.js'),
        '../../file.js',
    );
});

test('get_all_files', async (context) => {
    await context.test('works', () => {
        const files = get_all_files('tests/fixtures/get_all_files');
        assert.ok(files.includes('file'));
        assert.ok(files.includes('nested/file'));
        assert.equal(files.length, 2);
    });
    await context.test('throws exception when directory does not exist', () => {
        try {
            get_all_files('tests/fixtures/get_all_files/unknown');
            assert.fail();
        } catch (error) {
            assert.ok(true);
        }
    });
});

test('read_file', async (context) => {
    await context.test('works', () => {
        const content = read_file('tests/fixtures/read_file/file');
        assert.equal(content, 'lorem ipsum');
    });
    await context.test('throws exception when file does not exist', () => {
        try {
            read_file('tests/fixtures/read_file/unknown');
            assert.fail('should throw when file does not exist');
        } catch (error) {
            assert.ok(true);
        }
    });
});

test('path_exists', async () => {
    assert.ok(path_exists('tests/fixtures/path_exists'));
    assert.ok(!path_exists('tests/fixtures/path_exists/unknown'));
});

test('write_to_file', async (context) => {
    await context.test('works', () => {
        write_to_file('tests/fixtures/write_to_file/file', 'lorem ipsum');
        assert.equal(
            read_file('tests/fixtures/write_to_file/file'),
            'lorem ipsum',
        );
    });
    await context.test('can overwrite', () => {
        write_to_file('tests/fixtures/write_to_file/file', 'lorem ipsum');
        write_to_file('tests/fixtures/write_to_file/file', 'overwritten');
        assert.equal(
            read_file('tests/fixtures/write_to_file/file'),
            'overwritten',
        );
    });
});
