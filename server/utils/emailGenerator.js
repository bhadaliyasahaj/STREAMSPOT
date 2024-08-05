import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "mrbhadaliya@gmail.com",
    pass: "wfzyekwskwyxfiye",
  },
});

export const mailGenerator = async (email, name, code) => {
  try {
    const info = {
      from: '"StreamSpot 👻"<mrbhadaliya@gmail.com>',
      to: email,
      subject: `Welcome To StreamSpot`,
      html: `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .button { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; }
                .footer { font-size: 12px; color: #888; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome to VideoTube! ${name}</h2>
                <p>Thank you for signing up. Please verify your email address with code given below:</p>
                <p class="button">${code}</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p class="footer">VideoTube Team<br>support@videotube.com</p>
            </div>
        </body>
        </html>
    `,
    };

    await transporter.sendMail(info);
  } catch (err) {
    console.log("error");
    throw new Error("Error");
  }

  //   console.log("Message sent: %s", info.messageId);
};
