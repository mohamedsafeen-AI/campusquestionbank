/**
 * Upload page logic (admin-only gated by email header)
 */

const form = document.getElementById('uploadForm');
const messageEl = document.getElementById('formMessage');
const pdfFileInput = document.getElementById('pdfFile');
const pdfPreviewPill = document.getElementById('pdfPreviewPill');

let pdfBase64 = null;
let pdfFileName = null;

function setPill(text) {
  pdfPreviewPill.textContent = text;
}

pdfFileInput.addEventListener('change', async () => {
  const file = pdfFileInput.files && pdfFileInput.files[0];
  if (!file) {
    pdfBase64 = null;
    pdfFileName = null;
    setPill('No PDF selected');
    return;
  }

  if (file.type !== 'application/pdf') {
    showMessage(messageEl, 'Only PDF files are allowed.', 'error');
    pdfFileInput.value = '';
    pdfBase64 = null;
    pdfFileName = null;
    setPill('No PDF selected');
    return;
  }

  pdfFileName = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    // reader.result becomes a data URL
    pdfBase64 = reader.result;
    setPill(`Selected: ${file.name}`);
  };
  reader.readAsDataURL(file);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage(messageEl, 'Uploading...', 'info');

  try {
    const adminEmail = document.getElementById('adminEmail').value.trim();
    const subjectName = document.getElementById('subjectName').value.trim();
    const unitName = document.getElementById('unitName').value.trim();
    const questions = document.getElementById('questions').value.trim();
    const answers = document.getElementById('answers').value.trim();

    if (!adminEmail) throw new Error('Admin email is required.');
    if (!subjectName) throw new Error('Subject Name is required.');

    const payload = {
      subject_name: subjectName,
      unit_name: unitName,
      question: questions,
      answer: answers,
    };

    if (pdfBase64) {
      payload.pdf_base64 = pdfBase64;
      payload.pdf_file_name = pdfFileName;
    }

    const res = await apiPost('/api/upload', payload, { 'X-Admin-Email': adminEmail });
    showMessage(messageEl, res.message || 'Uploaded successfully.', 'success');
    form.reset();
    pdfBase64 = null;
    pdfFileName = null;
    setPill('No PDF selected');
  } catch (err) {
    showMessage(messageEl, err.message || 'Upload failed', 'error');
  }
});

document.getElementById('clearBtn').addEventListener('click', () => {
  form.reset();
  pdfBase64 = null;
  pdfFileName = null;
  setPill('No PDF selected');
  showMessage(messageEl, '', 'info');
});

