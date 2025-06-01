import nodemailer from 'nodemailer';

interface WelcomeEmailProps {
  email: string;
  name: string;
  phone: string;
  college: string;
  dept: string;
  username: string;
  password: string;
}

export const sendWelcomeEmail = async ({ email, name, phone, college, dept, username, password }: WelcomeEmailProps) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'ueducate2023@gmail.com',
      pass: 'suckyzoajhnsvsqe',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Ktec',
    text: `Dear ${name},

Welcome to Ktec! We are excited to have you on board.


Your login credentials are:
Username: ${username}
Password: ${password}

Please keep this information secure.

Best regards,
Ueducate Team`,
  };

  await transporter.sendMail(mailOptions);
};