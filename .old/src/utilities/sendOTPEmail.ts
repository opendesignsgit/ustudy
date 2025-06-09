import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'ueducate2023@gmail.com',
    pass: 'suckyzoajhnsvsqe',
  },
});

export const sendOTPEmail = async (recipientEmail: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: '"Ktec - Ueducate" <no-reply@yoursite.com>',
    to: recipientEmail,
    subject: 'Your Verification Code',
    html: `
      <p>Dear User,</p>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>Thank you,<br/>Ktec - Ueducate</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
