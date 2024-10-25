const nodemailer = require('nodemailer');

const sendMail = async (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ton email
      pass: process.env.EMAIL_PASS, // Ton mot de passe
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: content,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
