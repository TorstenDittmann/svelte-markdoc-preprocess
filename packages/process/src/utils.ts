import {
    existsSync,
    lstatSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'fs';
import { join } from 'path';

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

export function read_file(...target: string[]): string {
    return readFileSync(join(...target), 'utf8');
}

export function write_to_file(file: string, content: string): void {
    writeFileSync(file, content);
}

export function path_exists(path: string): boolean {
    return existsSync(path);
}
