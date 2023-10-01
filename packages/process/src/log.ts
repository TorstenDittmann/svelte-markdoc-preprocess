import { createLogger, Logger } from 'lovely-logs';
import type { ValidateError } from '@markdoc/markdoc';
import { th } from './default_schema';

createLogger({
    platform: 'console',
    timestampEnabled: false,
});

const NAMESPACE = '[svelte-markdoc-preprocess]:';

export function log_validation_error(
    validate_error: ValidateError,
    filename: string,
) {
    const { error } = validate_error;
    const prefix = `${NAMESPACE} ${filename}:${validate_error.lines.join(
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
            Logger.error(prefix, error.message);
    }
}

export function log_error(message: string) {
    Logger.error(`${NAMESPACE} ${message}`);
}
export function log_warning(message: string) {
    Logger.warn(`${NAMESPACE} ${message}`);
}
export function log_info(message: string) {
    Logger.info(`${NAMESPACE} ${message}`);
}
