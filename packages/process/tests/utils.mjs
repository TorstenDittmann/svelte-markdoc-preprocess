import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
export { relative_posix_path } from '../dist/utils.js';

export function absoulute(current, file) {
    return join(dirname(fileURLToPath(current)), file);
}

export function read_file(file) {
    return readFile(file, {
        encoding: 'utf8',
    });
}
