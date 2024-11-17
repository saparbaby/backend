const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Функция отправки письма
async function sendWelcomeEmail(email, firstName) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Welcome to Astana Portfolio!',
        text: `Hi ${firstName},\n\nThank you for registering on our platform!`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
