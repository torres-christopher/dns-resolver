// Dependencies
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Send contact form to me
exports.sendContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).render('contact', {
      success: false,
      error: 'All fields are required.',
    });
  }

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: 'DNS Lookup form', // Sender's email
      to: 'k.torres@seznam.cz', // Replace with your personal email
      subject: `DNS Lookup | Contact Form Submission from ${name}`,
      text: `You have a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Render the contact page with a success message
    res.status(200).render('contact-us', {
      success: true,
      message: 'Email successfully sent.',
    });
  } catch (error) {
    res.status(500).render('contact-us', {
      success: false,
      error: 'Failed to send the message. Please try again later.',
    });
  }
};
