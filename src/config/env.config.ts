/**
 * Rutas de archivos .env según NODE_ENV.
 * Prioridad: .env.{NODE_ENV} → .env
 */
export function getEnvFilePaths(): string[] {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    return [`.env.${nodeEnv}`, '.env'];
}
