const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (req, res) => {
    // ── CORS headers (required for Vercel serverless) ─────────────────────────
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

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
        console.error('Error sending visit email:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to send visit email.',
        });
    }
};
