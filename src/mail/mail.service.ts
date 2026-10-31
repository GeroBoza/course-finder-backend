import {
    Injectable,
    Logger,
    OnModuleInit,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { LeadMailPayload, SendMailOptions } from './mail.types';

const REQUIRED_KEYS = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'MAIL_FROM',
    'MAIL_NOTIFY_TO',
] as const;

@Injectable()
export class MailService implements OnModuleInit {
    private readonly logger = new Logger(MailService.name);
    private transporter: Transporter | null = null;
    private configured = false;
    private fromAddress = '';
    private notifyTo = '';

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        const missing = REQUIRED_KEYS.filter(
            (key) => !this.configService.get<string>(key)?.trim(),
        );

        if (missing.length > 0) {
            this.logger.warn(
                `Mail deshabilitado: faltan variables de entorno (${missing.join(', ')}). Los leads se guardan igual.`,
            );
            return;
        }

        const host = this.configService.getOrThrow<string>('SMTP_HOST').trim();
        const port = Number(
            this.configService.getOrThrow<string>('SMTP_PORT').trim(),
        );
        const user = this.configService.getOrThrow<string>('SMTP_USER').trim();
        const pass = this.configService.getOrThrow<string>('SMTP_PASS');
        this.fromAddress = this.configService
            .getOrThrow<string>('MAIL_FROM')
            .trim();
        this.notifyTo = this.configService
            .getOrThrow<string>('MAIL_NOTIFY_TO')
            .trim();

        if (!Number.isFinite(port) || port <= 0) {
            this.logger.error(
                'Mail deshabilitado: SMTP_PORT no es un número de puerto válido.',
            );
            return;
        }

        this.transporter = nodemailer.createTransport({
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

        this.configured = true;
        this.logger.log(
            `Mail listo (SMTP ${host}:${port}, from configurado, notify configurado).`,
        );
    }

    isConfigured(): boolean {
        return this.configured;
    }

    async sendMail(options: SendMailOptions): Promise<void> {
        if (!this.transporter || !this.configured) {
            throw new ServiceUnavailableException(
                'El servicio de correo no está configurado.',
            );
        }

        try {
            await this.transporter.sendMail({
                from: this.fromAddress,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                replyTo: options.replyTo,
            });
            this.logger.log(
                `Correo enviado (to=${this.maskEmail(options.to)}, subject="${options.subject}").`,
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Fallo al enviar correo (to=${this.maskEmail(options.to)}, subject="${options.subject}"): ${message}`,
            );
            throw error;
        }
    }

    /**
     * Envía en paralelo el aviso interno y la confirmación al interesado.
     * No relanza: un fallo de SMTP no debe romper el alta del lead.
     */
    async sendLeadEmails(payload: LeadMailPayload): Promise<void> {
        if (!this.configured) {
            this.logger.warn(
                'Lead creado sin envío de mails: servicio de correo no configurado.',
            );
            return;
        }

        const organizationLabel = payload.organizationName?.trim() || '—';
        const enrollmentLine = payload.enrollmentUrl?.trim()
            ? `URL de inscripción del emisor: ${payload.enrollmentUrl.trim()}`
            : 'El curso no tiene URL de inscripción cargada.';

        const notifySubject = `Nueva inscripción: ${payload.courseName}`;
        const notifyText = [
            'Se registró un nuevo interés desde CapaContinua.',
            '',
            `Curso: ${payload.courseName}`,
            `Organización: ${organizationLabel}`,
            `Nombre: ${payload.fullName}`,
            `Email: ${payload.email}`,
            `Teléfono: ${payload.phone}`,
            enrollmentLine,
        ].join('\n');

        const userSubject = `Recibimos tu interés en ${payload.courseName}`;
        const userText = [
            `Hola ${payload.fullName},`,
            '',
            `Recibimos tu solicitud de interés en el curso "${payload.courseName}" (${organizationLabel}) a través de CapaContinua.`,
            '',
            'La inscripción formal la gestiona la entidad que dicta el curso.',
            enrollmentLine,
            '',
            'Si no fuiste vos, podés ignorar este mensaje.',
            '',
            '— Equipo CapaContinua',
        ].join('\n');

        const results = await Promise.allSettled([
            this.sendMail({
                to: this.notifyTo,
                subject: notifySubject,
                text: notifyText,
                replyTo: payload.email,
            }),
            this.sendMail({
                to: payload.email,
                subject: userSubject,
                text: userText,
            }),
        ]);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const label =
                    index === 0
                        ? 'aviso interno'
                        : 'confirmación al interesado';
                const message =
                    result.reason instanceof Error
                        ? result.reason.message
                        : 'Error desconocido';
                this.logger.error(`Fallo el mail de ${label}: ${message}`);
            }
        });
    }

    private maskEmail(email: string): string {
        const [local, domain] = email.split('@');
        if (!domain) {
            return '***';
        }
        const visible = local.slice(0, 1) || '*';
        return `${visible}***@${domain}`;
    }
}
