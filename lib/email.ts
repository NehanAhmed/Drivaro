// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Your Car Rental <onboarding@resend.dev>', // Change to your verified domain
            to,
            subject,
            html: html || text,
            text: text,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}