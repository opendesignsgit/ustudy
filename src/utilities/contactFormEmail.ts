import nodemailer from 'nodemailer';

export interface ContactFormFields {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message?: string;
}

interface SendContactFormOptions {
  fields: ContactFormFields;
  adminEmail?: string; // fallback to env or default
  sendCopyToUser?: boolean;
}

export function validateContactForm(fields: ContactFormFields) {
  const errors: Record<string, string> = {};

  // Always required
  if (!fields.name?.trim()) errors.name = 'Full Name is required';
  if (!fields.email?.trim()) errors.email = 'Email is required';

  // Optional, but if present, validate
  if (fields.phone && !/^\+?\d{10,15}$/.test(fields.phone.replace(/\s/g, ""))) {
    errors.phone = 'Enter a valid phone number';
  }
  if (fields.email && !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(fields.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

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

function contactHtml(fields: ContactFormFields) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1f9714;">New Contact Form Submission</h2>
      <ul>
        <li><strong>Name:</strong> ${fields.name}</li>
        ${fields.phone ? `<li><strong>Phone:</strong> ${fields.phone}</li>` : ''}
        <li><strong>Email:</strong> ${fields.email}</li>
        ${fields.location ? `<li><strong>Location:</strong> ${fields.location}</li>` : ''}
        ${fields.message ? `<li><strong>Message:</strong><br/>${fields.message.replace(/\n/g, '<br/>')}</li>` : ''}
      </ul>
    </div>
  `;
}

function contactText(fields: ContactFormFields) {
  return `New Contact Form Submission:

Name: ${fields.name}
${fields.phone ? `Phone: ${fields.phone}\n` : ''}
Email: ${fields.email}
${fields.location ? `Location: ${fields.location}\n` : ''}
${fields.message ? `Message:\n${fields.message}` : ''}
`;
}

export async function sendContactFormEmail({
  fields,
  adminEmail,
  sendCopyToUser = true
}: SendContactFormOptions) {
  const adminTo = adminEmail || process.env.ADMIN_EMAIL || 'info@ustudyglobal.in';

  // Send to admin
  const adminMailOptions = {
    from: process.env.EMAIL_FROM || 'UStudy Global <info@ustudyglobal.in>',
    to: "info@ustudyglobal.in",
    subject: 'New Contact Form Submission',
    text: contactText(fields),
    html: contactHtml(fields),
  };

  const tasks = [transporter.sendMail(adminMailOptions)];

  // Optionally send a confirmation/copy to the user
  if (sendCopyToUser && fields.email) {
    const userMailOptions = {
      from: process.env.EMAIL_FROM || 'UStudy Global <info@ustudyglobal.in>',
      to: fields.email,
      subject: 'We have received your inquiry',
      text: `Dear ${fields.name},

Thank you for contacting UStudy Global.
We have received your message and will get back to you soon.

Best regards,
UStudy Global Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f9714;">Thank you for contacting UStudy Global!</h2>
          <p>Dear ${fields.name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <p>Best regards,<br/>UStudy Global Team</p>
        </div>
      `
    };
    tasks.push(transporter.sendMail(userMailOptions));
  }

  await Promise.all(tasks);
}