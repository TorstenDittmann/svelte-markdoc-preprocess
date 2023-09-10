import { createLogger, Logger } from 'lovely-logs';
import type { ValidateError } from '@markdoc/markdoc';

createLogger({
    platform: 'console',
    timestampEnabled: false,
});

export function log_validation_error(
    validate_error: ValidateError,
    filename: string,
) {
    const { error } = validate_error;
    const prefix = `[svelte-markdoc-preprocess] ${filename}:${validate_error.lines.join(
        ':',
    )} (${error.id}) `;

    switch (error.level) {
        case 'debug':
        case 'info':
            return Logger.info(prefix, error.message);
        case 'warning':
            return Logger.warn(prefix, error.message);
        case 'error':
        case 'critical':
            return Logger.error(prefix, error.message);
    }
}

export function log_error(message: string) {
    Logger.error(`[svelte-markdoc-preprocess]: ${message}`);
}
export function log_warning(message: string) {
    Logger.warn(`[svelte-markdoc-preprocess]: ${message}`);
}
export function log_info(message: string) {
    Logger.info(`[svelte-markdoc-preprocess]: ${message}`);
}
