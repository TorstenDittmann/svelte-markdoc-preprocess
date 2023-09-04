import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
export { relative_posix_path, read_file } from '../dist/utils.js';

export function absoulute(current, file) {
    return join(dirname(fileURLToPath(current)), file);
}
