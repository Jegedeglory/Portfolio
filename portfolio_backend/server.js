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
    'http://127.0.0.1:3000',
    'https://portfolio-cwjm.onrender.com',
    process.env.FRONTEND_URL, // optional env override
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. curl, sendBeacon) or matching origins
            if (!origin || !process.env.FRONTEND_URL || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept'],
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

// ─── POST /visit (Silent Visitor Tracker) ────────────────────────────────────
app.post('/visit', async (req, res) => {
    try {
        const {
            city,
            country,
            region,
            countryCode,
            ip,
            isp,
            deviceType,
            browser,
            os,
            screenResolution,
            viewport,
            referrer,
            pageUrl,
            timeZone,
            timestamp,
        } = req.body || {};

        const clientIp = ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'Unknown';
        const displayLocation = [city, region, country].filter(Boolean).join(', ') || 'Unknown Location';
        const displayDevice = [deviceType, os, browser].filter(Boolean).join(' • ') || 'Unknown Device';
        const displayReferrer = referrer || 'Direct visit / Bookmark';
        const displayTime = timestamp || new Date().toLocaleString('en-US');
        const flag = countryCode ? `[${countryCode}] ` : '';

        const subject = `🔔 [Portfolio Visit] ${flag}${displayLocation} (${deviceType || 'Visitor'})`;

        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #151515; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #242424;">
                <div style="background: linear-gradient(135deg, #1f1f1f 0%, #111111 100%); padding: 28px 24px; border-bottom: 2px solid #4ee1a0;">
                    <div style="display: inline-block; background: rgba(78, 225, 160, 0.15); color: #4ee1a0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase;">
                        Silent Visit Alert
                    </div>
                    <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">
                        👀 Someone just visited your portfolio!
                    </h2>
                    <p style="margin: 6px 0 0 0; color: #a0a0a0; font-size: 14px;">
                        A visitor just landed on your portfolio website.
                    </p>
                </div>

                <div style="padding: 24px;">
                    <!-- Key Highlight Cards -->
                    <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-bottom: 20px;">
                        <tr>
                            <td style="background: #202020; padding: 14px; border-radius: 8px; border-left: 3px solid #4ee1a0; width: 50%; vertical-align: top;">
                                <span style="font-size: 11px; text-transform: uppercase; color: #888888; font-weight: 600; display: block; margin-bottom: 4px;">Location</span>
                                <span style="font-size: 15px; color: #ffffff; font-weight: 600;">${displayLocation}</span>
                            </td>
                            <td style="background: #202020; padding: 14px; border-radius: 8px; border-left: 3px solid #4ee1a0; width: 50%; vertical-align: top;">
                                <span style="font-size: 11px; text-transform: uppercase; color: #888888; font-weight: 600; display: block; margin-bottom: 4px;">Device</span>
                                <span style="font-size: 15px; color: #ffffff; font-weight: 600;">${displayDevice}</span>
                            </td>
                        </tr>
                    </table>

                    <!-- Details Table -->
                    <table style="width: 100%; border-collapse: collapse; background: #1c1c1c; border-radius: 8px; overflow: hidden; font-size: 13px;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #282828;">
                                <td style="padding: 12px 16px; color: #888888; width: 150px; font-weight: 500;">🔗 Referral Source</td>
                                <td style="padding: 12px 16px; color: #ffffff; font-weight: 600;">${displayReferrer}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #282828;">
                                <td style="padding: 12px 16px; color: #888888; font-weight: 500;">🌐 Landing Page</td>
                                <td style="padding: 12px 16px; color: #4ee1a0; word-break: break-all;">
                                    <a href="${pageUrl || '#'}" style="color: #4ee1a0; text-decoration: none;">${pageUrl || 'Home page'}</a>
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid #282828;">
                                <td style="padding: 12px 16px; color: #888888; font-weight: 500;">🖥️ Screen / Viewport</td>
                                <td style="padding: 12px 16px; color: #ffffff;">${screenResolution || 'Unknown'} (viewport: ${viewport || 'N/A'})</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #282828;">
                                <td style="padding: 12px 16px; color: #888888; font-weight: 500;">⏰ Visit Time</td>
                                <td style="padding: 12px 16px; color: #ffffff;">${displayTime} ${timeZone ? `(${timeZone})` : ''}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 16px; color: #888888; font-weight: 500;">📍 IP / Provider</td>
                                <td style="padding: 12px 16px; color: #cccccc; font-family: monospace; font-size: 12px;">
                                    ${clientIp} ${isp ? `• ${isp}` : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #282828; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #666666;">
                            Portfolio Silent Tracking • Delivered to tobygrey216@gmail.com • Invisible to visitor
                        </p>
                    </div>
                </div>
            </div>
        `;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('ℹ️ Visit received, but EMAIL_USER or EMAIL_PASS not configured in .env:');
            console.log({ displayLocation, displayDevice, displayReferrer, clientIp, displayTime });
            return res.status(200).json({ success: true, note: 'Email credentials not configured in backend' });
        }

        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"Portfolio Visitor Alert" <${process.env.EMAIL_USER}>`,
            to: 'tobygrey216@gmail.com',
            subject: subject,
            text: `New Portfolio Visit:\nLocation: ${displayLocation}\nDevice: ${displayDevice}\nReferrer: ${displayReferrer}\nTime: ${displayTime}\nIP: ${clientIp}\nPage: ${pageUrl}`,
            html: html,
        });

        console.log('✅ Visit email sent:', info.messageId);
        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Error handling visit alert:', error.message);
        return res.status(500).json({ success: false, error: error.message });
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
