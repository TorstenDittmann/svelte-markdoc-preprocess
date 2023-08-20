import { lstatSync, readdirSync } from 'fs';

export function get_all_files(path: string): string[] {
    const files = [];
    for (const file of readdirSync(path)) {
        const fullPath = path + '/' + file;
        if (lstatSync(fullPath).isDirectory())
            get_all_files(fullPath).forEach((x) => files.push(file + '/' + x));
        else files.push(file);
    }
    return files;
}
