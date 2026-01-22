import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create reusable transporter object using Gmail SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME || 'AppointHQ'} <${process.env.FROM_EMAIL || 'noreply@appointhq.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`, // Fallback to HTML version of text
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  return info;
};

export default sendEmail;