import nodemailer from 'nodemailer';
export const sendEmail = async ({email,subject,message}) => {
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to:email,
            subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}