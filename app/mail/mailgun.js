const axios = require('axios');

exports.sendVerificationEmail = async (recipientEmail, verificationLink) => {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const senderEmail = process.env.SENDER_EMAIL;

    const mailgunUrl = `https://api.mailgun.net/v3/${domain}/messages`;

    const auth = 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64');

    const data = new URLSearchParams();
    data.append('from', `Excited User <${senderEmail}>`);
    data.append('to', recipientEmail);
    data.append('subject', 'Verify Your Email');
    data.append('text', `Please click on the following link to verify your email: ${verificationLink}`);

    try {
        const response = await axios.post(mailgunUrl, data, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

