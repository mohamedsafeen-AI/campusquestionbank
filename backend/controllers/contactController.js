/**
 * Contact controller
 * Sends an email via Gmail SMTP using Nodemailer.
 */

const { transporter } = require('../config/email');
const { requireFields } = require('../middleware/validate');
const { supabase } = require('../config/supabase');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function createMessage(req, res) {
  try {
    const body = req.body || {};
    const missing = requireFields(body, ['name', 'email', 'message']);
    if (missing.length) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    const name = String(body.name).trim();
    const email = String(body.email).trim();
    const message = String(body.message).trim();

    // Store in Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert({ name, email, message })
      .select()
      .single();

    if (error) throw error;

    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: ADMIN_EMAIL,
      subject: 'Campus Question Bank - New Contact Message',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: 'Message sent successfully.', saved: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}

module.exports = { createMessage };

