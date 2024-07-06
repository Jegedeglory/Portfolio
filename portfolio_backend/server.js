const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jegsboy007@gmail.com', // Your email address
            pass: 'yovcfcwjxeohrqnt'   // Your email password or app-specific password
        }
    });

    const mailOptions = {
        from: email,
        to: 'jegsboy007@gmail.com', // Change to your recipient
        subject: 'New Contact Form Enquiry',
        html: `<strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Message:</strong> ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
