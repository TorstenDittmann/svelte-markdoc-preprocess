import {
    existsSync,
    lstatSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'fs';
import { dirname, join, relative, sep } from 'path';
import { sep as posix_sep } from 'path/posix';

export function get_all_files(path: string): string[] {
    const files = [];
    for (const file of readdirSync(path)) {
        const fullPath = path + posix_sep + file;
        if (lstatSync(fullPath).isDirectory()) {
            get_all_files(fullPath).forEach((x) =>
                files.push(file + posix_sep + x),
            );
        } else {
            files.push(file);
        }
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

export function relative_posix_path(from: string, to: string): string {
    return relative(dirname(from), to).split(sep).join(posix_sep);
}

export function is_external_url(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

export function is_relative_path(path: string): boolean {
    return (
        path.startsWith('./') ||
        path.startsWith('../') ||
        path.startsWith('$lib')
    );
}

export function parse_query_params_from_string(
    string: string,
): URLSearchParams {
    const index = string.indexOf('?');
    if (index === -1) {
        return new URLSearchParams();
    }
    string = string.slice(index);

    return new URLSearchParams(string);
}

export function replace_query_params_from_string(
    string: string,
    params: URLSearchParams,
): string {
    const index = string.indexOf('?');
    if (index !== -1) {
        string = string.slice(0, index);
    }

    return string + '?' + params.toString();
}
