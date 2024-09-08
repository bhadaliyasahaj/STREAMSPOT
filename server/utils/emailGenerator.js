import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const mailGenerator = async (email, name, code, link) => {
  try {
    const info = {
      from: '"StreamSpot 👻"<mrbhadaliya@gmail.com>',
      to: email,
      subject: link ? `Change Your Password` : `Welcome To StreamSpot`,
      html: link
        ? `<html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .button { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: 600; }
            .footer { font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your account. Click the button below to reset your password:</p>
            <p style="text-align: center;">
                <a href="${link}" class="button">Reset Password</a>
            </p>
            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
            <p>For your security, this link will expire in 1 hour.</p>
            <p class="footer">StreamSpot Team<br>support@StreamSpot.com</p>
        </div>
    </body>
</html`
        : `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .button { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #007bff; border:3px solid #007bff; text-decoration: none; border-radius: 5px; font-weight:600; }
                .footer { font-size: 12px; color: #888; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome to StreamSpot! ${name}</h2>
                <p>Thank you for signing up. Please verify your email address with code given below:</p>
                <p class="button">${code}</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p class="footer">StreamSpot Team<br>support@StreamSpot.com</p>
            </div>
        </body>
        </html>
    `,
    };

    await transporter.sendMail(info);
  } catch (err) {
    console.log(err);
    throw new Error("Error");
  }

  //   console.log("Message sent: %s", info.messageId);
};
