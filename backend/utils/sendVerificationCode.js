import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";
export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message=generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
             email,
            subject: "Verify your email",
             message,
        });
        res.status(200).json({
            success: true,
            message: `Verification code sent to ${email}`,
        });
    }
    catch (error) {
      return  res.status(500).json({
            success: false,
            message: "Error sending verification code",
        });
    }
}
