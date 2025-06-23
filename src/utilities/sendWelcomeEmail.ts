// utilities/sendWelcomeEmail.ts
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

interface BookingEmailProps {
  email: string;
  name: string;
  courseName: string;
  universityName: string;
  amountPaid: number;
  currency: string;
  bookingDate: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'ueducate2023@gmail.com',
    pass: 'suckyzoajhnsvsqe',
    // user: 'info@ustudyglobal.co',
    // pass: 'ynaevbaookrvumsm',
  },
});

export const sendWelcomeEmail = async ({ 
  email, 
  name, 
  phone, 
  college, 
  dept, 
  username, 
  password 
}: WelcomeEmailProps) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'UStudy Global <info@ustudyglobal.co>',
    to: email,
    subject: 'Welcome to UStudy Global',
    text: `Dear ${name},

Welcome to UStudy Global! We are excited to have you on board.

Your login credentials are:
Username: ${username}
Password: ${password}

Please keep this information secure.

Best regards,
UStudy Global Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f9714;">Welcome to UStudy Global!</h2>
        <p>Dear ${name},</p>
        <p>We are excited to have you on board.</p>
        
        <h3 style="color: #1f9714;">Your Account Details:</h3>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        
        <p style="color: #ff0000;">Please keep this information secure.</p>
        
        <p>Best regards,<br/>UStudy Global Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookingConfirmation = async ({
  email,
  name,
  courseName,
  universityName,
  amountPaid,
  currency,
  bookingDate
}: BookingEmailProps) => {
  // Send to student
  const studentMailOptions = {
    from: process.env.EMAIL_FROM || 'UStudy Global <info@ustudyglobal.co>',
    to: email,
    subject: 'Your Course Booking Confirmation',
    text: `Dear ${name},

Thank you for enrolling in ${courseName} with UStudy Global.

Booking Details:
- University: ${universityName}
- Course: ${courseName}
- Amount Paid: ${currency} ${amountPaid}
- Booking Date: ${bookingDate}

We will contact you shortly with further details.

Best regards,
UStudy Global Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f9714;">Course Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for enrolling in <strong>${courseName}</strong> with UStudy Global.</p>
        
        <h3 style="color: #1f9714;">Booking Details:</h3>
        <ul>
          <li><strong>University:</strong> ${universityName}</li>
          <li><strong>Course:</strong> ${courseName}</li>
          <li><strong>Amount Paid:</strong> ${currency} ${amountPaid}</li>
          <li><strong>Booking Date:</strong> ${bookingDate}</li>
        </ul>
        
        <p>We will contact you shortly with further details.</p>
        
        <p>Best regards,<br/>UStudy Global Team</p>
      </div>
    `
  };

  // Send to admin (second email)
  const adminMailOptions = {
    from: process.env.EMAIL_FROM || 'UStudy Global <info@ustudyglobal.co>',
    to: process.env.ADMIN_EMAIL || 'info@ustudyglobal.co' || email,
    subject: `New Booking: ${courseName}`,
    text: `New course booking received:

Student: ${name} (${email})
Course: ${courseName}
University: ${universityName}
Amount: ${currency} ${amountPaid}
Booking Date: ${bookingDate}

Please process this enrollment.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f9714;">New Course Booking</h2>
        <h3>${courseName}</h3>
        
        <h3 style="color: #1f9714;">Student Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        
        <h3 style="color: #1f9714;">Booking Details:</h3>
        <ul>
          <li><strong>Course:</strong> ${courseName}  at ${universityName}</li>
          <li><strong>Amount:</strong> ${currency} ${amountPaid}</li>
          <li><strong>Booking Date:</strong> ${bookingDate}</li>
        </ul>
        
        <p>Please process this enrollment.</p>
      </div>
    `
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(studentMailOptions),
    transporter.sendMail(adminMailOptions)
  ]);
};