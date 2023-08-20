import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export function absoulute(current, file) {
    return join(dirname(fileURLToPath(current)), file);
}
