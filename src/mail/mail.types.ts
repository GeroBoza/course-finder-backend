export interface SendMailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
}

export interface LeadMailPayload {
    fullName: string;
    email: string;
    phone: string;
    courseName: string;
    organizationName?: string | null;
    enrollmentUrl?: string | null;
}
