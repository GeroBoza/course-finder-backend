/**
 * Envía un único correo de prueba por SMTP (EnvíaloSimple).
 * Uso: npm run mail:test -- destinatario@ejemplo.com
 *
 * Requiere las variables SMTP_* y MAIL_FROM en .env / .env.{NODE_ENV}.
 * No imprime contraseñas ni el cuerpo completo del mensaje.
 */
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { getEnvFilePaths } from '../src/config/env.config';

for (const path of getEnvFilePaths()) {
    dotenv.config({ path, quiet: true });
}
const to = process.argv[2]?.trim();

if (!to) {
    console.error('Uso: npm run mail:test -- <email-destino>');
    process.exit(1);
}

const required = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'MAIL_FROM',
] as const;

const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
    console.error(
        `Faltan variables de entorno: ${missing.join(', ')}. Revisá .env (no se muestran valores).`,
    );
    process.exit(1);
}

const host = process.env.SMTP_HOST!.trim();
const port = Number(process.env.SMTP_PORT!.trim());
const user = process.env.SMTP_USER!.trim();
const pass = process.env.SMTP_PASS!;
const from = process.env.MAIL_FROM!.trim();

if (!Number.isFinite(port) || port <= 0) {
    console.error('SMTP_PORT no es un número de puerto válido.');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    tls: {
        minVersion: 'TLSv1.3',
        rejectUnauthorized: true,
    },
});

async function main(): Promise<void> {
    console.log(
        `Enviando prueba a ${to} vía ${host}:${port} (STARTTLS, TLSv1.3)...`,
    );

    await transporter.sendMail({
        from,
        to,
        subject: 'Prueba SMTP CapaContinua',
        text: [
            'Este es un correo de prueba del backend de CapaContinua.',
            `Enviado a las ${new Date().toISOString()}.`,
        ].join('\n'),
    });

    console.log('OK: correo de prueba aceptado por el servidor SMTP.');
}

main().catch((error: unknown) => {
    const message =
        error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Error al enviar correo de prueba: ${message}`);
    process.exit(1);
});
