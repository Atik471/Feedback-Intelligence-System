import nodemailer from 'nodemailer';
import { IFeedback } from '../models/feedback.model';

// Map teams to email addresses — populated at runtime via the frontend
const teamEmails: Record<string, string> = {};

export function setTeamEmails(emails: Record<string, string>) {
    Object.assign(teamEmails, emails);
}

function createTransport() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export async function sendFeedbackNotification(
    feedback: IFeedback,
    teamEmail?: string
): Promise<void> {
    if (process.env.EMAIL_ENABLED !== 'true') return;

    const recipient = teamEmail || teamEmails[feedback.team] || process.env.SMTP_USER;
    if (!recipient) {
        console.warn('[Email] No recipient address found for team:', feedback.team);
        return;
    }

    const priorityEmoji: Record<string, string> = {
        Critical: '🔴',
        High: '🟠',
        Medium: '🟡',
        Low: '🟢',
    };

    const sentimentEmoji: Record<string, string> = {
        Negative: '😡',
        Neutral: '😐',
        Positive: '😊',
    };

    const transport = createTransport();

    await transport.sendMail({
        from: `"Feedback Intelligence" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: `[${priorityEmoji[feedback.priority]} ${feedback.priority}] New ${feedback.category} Feedback — ${feedback.title}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Feedback Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Title</td><td style="padding: 8px;">${feedback.title}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Submitted By</td><td style="padding: 8px;">${feedback.submittedBy}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Category</td><td style="padding: 8px;">${feedback.category}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Priority</td><td style="padding: 8px;">${priorityEmoji[feedback.priority]} ${feedback.priority}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Sentiment</td><td style="padding: 8px;">${sentimentEmoji[feedback.sentiment]} ${feedback.sentiment}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Assigned Team</td><td style="padding: 8px;">${feedback.team}</td></tr>
        </table>
        <h3 style="color: #374151;">Description</h3>
        <p style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${feedback.description}</p>
        <p style="color: #9ca3af; font-size: 12px;">Feedback Intelligence System — Auto-generated notification</p>
      </div>
    `,
    });

    console.log(`[Email] Notification sent to ${recipient} for feedback: ${feedback.title}`);
}
