import { createLogger } from 'lovely-logs';
import type { ValidateError } from '@markdoc/markdoc';

const logger = createLogger({
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
            return logger.info(prefix, error.message);
        case 'warning':
            return logger.warn(prefix, error.message);
        case 'error':
        case 'critical':
            logger.error(prefix, error.message);
    }
}

export function log_error(message: string) {
    logger.error(`${NAMESPACE} ${message}`);
}
export function log_warning(message: string) {
    logger.warn(`${NAMESPACE} ${message}`);
}
export function log_info(message: string) {
    logger.info(`${NAMESPACE} ${message}`);
}
