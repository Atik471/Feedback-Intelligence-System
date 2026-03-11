import nodemailer from 'nodemailer';
import { IFeedback } from '../models/feedback.model';

// Map teams to email addresses — populated at runtime via the frontend
const teamEmails: Record<string, string> = {};

export function setTeamEmails(emails: Record<string, string>) {
    Object.assign(teamEmails, emails);
}

function createTransport() {
    const port = Number(process.env.SMTP_PORT) || 465;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.resend.com',
        port: port,
        secure: port === 465, // Use SSL for port 465
        auth: {
            user: process.env.SMTP_USER || 'resend',
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

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    await transport.sendMail({
        from: `"Feedback Intelligence" <${fromEmail}>`,
        to: recipient,
        subject: `[${priorityEmoji[feedback.priority]} ${feedback.priority}] New ${feedback.category} Feedback — ${feedback.title}`,
        text: `
          NEW FEEDBACK RECEIVED
          ---------------------
          Title: ${feedback.title}
          Submitted By: ${feedback.submittedBy}
          Category: ${feedback.category}
          Priority: ${feedback.priority}
          Sentiment: ${feedback.sentiment}
          Assigned Team: ${feedback.team}

          DESCRIPTION:
          ${feedback.description}

          Feedback Intelligence System — Auto-generated notification
        `,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
        <h2 style="color: #6366f1; margin-top: 0;">New Feedback Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Title</td><td style="padding: 8px;">${feedback.title}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Submitted By</td><td style="padding: 8px;">${feedback.submittedBy}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Category</td><td style="padding: 8px;">${feedback.category}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Priority</td><td style="padding: 8px;">${priorityEmoji[feedback.priority]} ${feedback.priority}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Sentiment</td><td style="padding: 8px;">${sentimentEmoji[feedback.sentiment]} ${feedback.sentiment}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Assigned Team</td><td style="padding: 8px;">${feedback.team}</td></tr>
        </table>
        <h3 style="color: #374151; margin-bottom: 8px;">Description</h3>
        <p style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap; margin: 0; color: #1f2937;">${feedback.description}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">Feedback Intelligence System — This is a system notification sent to ${recipient}.</p>
      </div>
    `,
        headers: {
            'X-Entity-Ref-ID': feedback._id.toString(),
            'X-Priority': feedback.priority === 'Critical' ? '1' : '3',
            'Precedence': 'bulk',
        },
    });

    console.log(`[Email] Notification sent to ${recipient} for feedback: ${feedback.title}`);
}
