const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from the portfolio frontend (adjust origin as needed)
const allowedOrigins = [
    'http://localhost:3000',
    'https://portfolio-cwjm.onrender.com',
    process.env.FRONTEND_URL, // optional env override
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. Postman, curl) or matching origins
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
    })
);

// ─── Nodemailer Transporter ───────────────────────────────────────────────────
// Uses Gmail with an App Password (not your main Gmail password).
// Generate one at: https://myaccount.google.com/apppasswords
const createTransporter = () =>
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // the Gmail account used to SEND
            pass: process.env.EMAIL_PASS, // Gmail App Password
        },
    });

// ─── Simple input validator ───────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── POST /send ───────────────────────────────────────────────────────────────
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'A valid name is required.' });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    // ── Build email ───────────────────────────────────────────────────────────
    // NOTE: Gmail only allows sending FROM the authenticated account.
    // We use `replyTo` so you can reply directly to the visitor's email.
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: 'jegsboy007@gmail.com',           // always delivered here
        replyTo: email,                        // reply goes back to the visitor
        subject: `Portfolio enquiry from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email}\n\nMessage:\n${message.trim()}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #4ee1a0; margin-bottom: 16px;">New Portfolio Enquiry</h2>
                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; color: #333; width: 100px;">Name:</td>
                        <td style="padding: 8px; color: #555;">${name.trim()}</td>
                    </tr>
                    <tr style="background:#fff;">
                        <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
                        <td style="padding: 8px; color: #555;">
                            <a href="mailto:${email}" style="color: #4ee1a0;">${email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; color: #333; vertical-align: top;">Message:</td>
                        <td style="padding: 8px; color: #555; white-space: pre-wrap;">${message.trim()}</td>
                    </tr>
                </table>
                <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
                    Sent via your portfolio contact form at ${new Date().toUTCString()}
                </p>
            </div>
        `,
    };

    // ── Send ──────────────────────────────────────────────────────────────────
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER or EMAIL_PASS environment variables are not configured in .env');
        return res.status(500).json({
            success: false,
            error: 'Server email credentials are not configured. Please set EMAIL_USER and EMAIL_PASS in .env',
        });
    }

    try {
        const transporter = createTransporter();
        // Verify credentials on startup (optional but helpful for debugging)
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again later.',
        });
    }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── 404 fallback ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📧 Emails will be delivered to: jegsboy007@gmail.com`);
});
