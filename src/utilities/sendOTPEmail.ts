import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'ueducate2023@gmail.com',
    pass: 'suckyzoajhnsvsqe',
    // user: 'info@ustudyglobal.in',
    // pass: 'ynaevbaookrvumsm',
  },
});

export const sendOTPEmail = async (recipientEmail: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: '"UStudy Global" <info@ustudyglobal.in>',
    to: recipientEmail,
    subject: 'Your Verification Code',
    html: `
      <p>Dear User,</p>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>Thank you,<br/>UStudy Global</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
