/**
 * Admin gate using a simple email-based method.
 *
 * Client must send:
 *   - X-Admin-Email: <user email>
 *
 * Backend compares it with ADMIN_EMAIL.
 *
 * NOTE: This is not as secure as JWT-based auth, but matches the requested spec.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function requireAdmin(req, res, next) {
  const adminEmailHeader = (req.header('X-Admin-Email') || '').trim().toLowerCase();
  const adminEmail = (ADMIN_EMAIL || '').trim().toLowerCase();

  if (!adminEmail) {
    return res.status(500).json({ error: 'Admin email is not configured on server.' });
  }

  // Allow only if the header matches ADMIN_EMAIL
  if (adminEmailHeader && adminEmailHeader === adminEmail) {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required.' });
}

module.exports = { requireAdmin };

