/**
 * Basic request validation helpers.
 */

function requireFields(body, fields) {
  const missing = [];

  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || String(val).trim() === '') missing.push(field);
  }

  return missing;
}

module.exports = { requireFields };

