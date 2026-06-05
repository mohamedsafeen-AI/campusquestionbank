/**
 * Materials controller
 * - Upload (admin only) 
 * - List (public)
 * - Get by id (public)
 * - Delete (admin only)
 */

const path = require('path');
const { supabase } = require('../config/supabase');
const { requireFields } = require('../middleware/validate');

const PDF_BUCKET = 'question_pdfs';

// In this app we store the *object name* in `pdf_url`.
// The frontend builds the public URL as:
//   <SUPABASE_URL>/storage/v1/object/public/<bucket>/<objectName>
// (Only works if the bucket is configured as public.)
function getPublicPdfUrl(objectName) {
  return objectName;
}

async function uploadPdfAndGetUrl(fileName, fileBase64) {
  // fileBase64 is expected to be a data URL or raw base64.
  // Supported format: data:application/pdf;base64,....

  let base64 = fileBase64;
  const match = String(fileBase64).match(/^data:application\/pdf;base64,(.*)$/);
  if (match) base64 = match[1];

  const buffer = Buffer.from(base64, 'base64');

  const ext = path.extname(fileName) || '.pdf';
  const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

  // store path under a folder for easier cleanup
  const objectName = `${Date.now()}_${safeBaseName}${ext}`;

  const uploadRes = await supabase.storage
    .from(PDF_BUCKET)
    .upload(objectName, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadRes.error) throw uploadRes.error;

  // objectName is enough to build a public URL. We'll store it as pdf_url.
  // Frontend will display/download using the public bucket URL.
  return objectName;
}

async function createMaterial(req, res) {
  try {
    // Admin gate already handled by middleware.
    // In this spec, admin identifies by email header.

    const body = req.body || {};

    const missing = requireFields(body, ['subject_name', 'unit_name', 'question', 'answer']);
    if (missing.length) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    const { subject_name, unit_name, question, answer, pdf_base64, pdf_file_name } = body;

    let pdf_url = null;
    if (pdf_base64) {
      if (!pdf_file_name) {
        return res.status(400).json({ error: 'pdf_file_name is required when pdf_base64 is provided.' });
      }

      const storedObjectName = await uploadPdfAndGetUrl(pdf_file_name, pdf_base64);
      pdf_url = getPublicPdfUrl(storedObjectName);
    }

    const insertPayload = {
      subject_name: String(subject_name).trim(),
      unit_name: String(unit_name).trim(),
      question: String(question).trim(),
      answer: String(answer).trim(),
      pdf_url,
    };

    const { data, error } = await supabase.from('materials').insert(insertPayload).select().single();

    if (error) throw error;

    return res.status(201).json({ message: 'Material uploaded successfully.', material: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to upload material.' });
  }
}

async function listMaterials(req, res) {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('id, subject_name, unit_name, question, answer, pdf_url, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ materials: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch materials.' });
  }
}

async function getMaterialById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('materials')
      .select('id, subject_name, unit_name, question, answer, pdf_url, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;

    return res.status(200).json({ material: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch material.' });
  }
}

async function deleteMaterial(req, res) {
  try {
    const { id } = req.params;

    // Fetch record first to delete PDF from storage (if exists)
    const { data: existing, error: fetchErr } = await supabase
      .from('materials')
      .select('id, pdf_url')
      .eq('id', id)
      .single();

    if (fetchErr) throw fetchErr;

    if (existing?.pdf_url) {
      const objectName = existing.pdf_url; // stored as object name
      const { error: storageErr } = await supabase.storage.from(PDF_BUCKET).remove([objectName]);
      // If removal fails (e.g., already missing), do not block deletion
      if (storageErr) console.warn('PDF removal failed:', storageErr.message);
    }

    const { error: delErr } = await supabase.from('materials').delete().eq('id', id);
    if (delErr) throw delErr;

    return res.status(200).json({ message: 'Material deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete material.' });
  }
}

module.exports = {
  createMaterial,
  listMaterials,
  getMaterialById,
  deleteMaterial,
};

