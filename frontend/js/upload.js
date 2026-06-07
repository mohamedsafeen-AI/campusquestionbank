/**
 * Upload page logic - Secured with strict null checks
 */

const form = document.getElementById('uploadForm');
const messageEl = document.getElementById('formMessage');
const pdfFileInput = document.getElementById('pdfFile');
const pdfPreviewPill = document.getElementById('pdfPreviewPill');

let pdfBase64 = null;
let pdfFileName = null;

function setPill(text) {
  if (pdfPreviewPill) pdfPreviewPill.textContent = text;
}

if (pdfFileInput) {
  pdfFileInput.addEventListener('change', async () => {
    const file = pdfFileInput.files && pdfFileInput.files[0];
    if (!file) {
      pdfBase64 = null;
      pdfFileName = null;
      setPill('No PDF selected');
      return;
    }

    if (file.type !== 'application/pdf') {
      if (messageEl) showMessage(messageEl, 'Only PDF files are allowed.', 'error');
      pdfFileInput.value = '';
      pdfBase64 = null;
      pdfFileName = null;
      setPill('No PDF selected');
      return;
    }

    pdfFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      pdfBase64 = reader.result;
      setPill(`Selected: ${file.name}`);
    };
    reader.readAsDataURL(file);
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (messageEl) showMessage(messageEl, 'Uploading...', 'info');

    try {
      // 💡 null எர்ரர் வராதபடி பாதுகாப்பாக மதிப்புகளை எடுக்கும் முறை:
      const adminEmailEl = document.getElementById('adminEmail') || document.getElementById('admin_email');
      const subjectEl    = document.getElementById('subject') || document.getElementById('subjectName') || document.getElementById('subject_name');
      const unitEl       = document.getElementById('unit') || document.getElementById('unitName') || document.getElementById('unit_name');
      const questionsEl  = document.getElementById('questions') || document.getElementById('question');
      const answersEl    = document.getElementById('answers') || document.getElementById('answer');

      // கட்டாய ஃபீல்டுகள் இருக்கிறதா எனச் சரிபார்த்தல்
      if (!subjectEl) throw new Error('Subject input element missing in HTML!');
      
      const adminEmail = adminEmailEl ? adminEmailEl.value.trim() : 'admin@gmail.com';
      const subjectName = subjectEl.value.trim();
      const unitName    = unitEl ? unitEl.value.trim() : '';
      const questions   = questionsEl ? questionsEl.value.trim() : '';
      const answers     = answersEl ? answersEl.value.trim() : '';

      if (!subjectName) throw new Error('Subject Name is required.');

      // சர்வருக்கு அனுப்ப வேண்டிய தரவு அமைப்பு
      const payload = {
        subject_name: subjectName,
        unit_name: unitName,
        questions: questions, 
        answers: answers
      };

      if (pdfBase64) {
        payload.pdf_base64 = pdfBase64;
        payload.pdf_file_name = pdfFileName;
      }

      // நம்பகமான apiPost-ஐப் பயன்படுத்தி சர்வருக்கு அனுப்புதல்
      const res = await apiPost('/api/upload', payload, { 'X-Admin-Email': adminEmail });
      
      if (messageEl) showMessage(messageEl, res.message || 'Uploaded successfully.', 'success');
      form.reset();
      pdfBase64 = null;
      pdfFileName = null;
      setPill('No PDF selected');
    } catch (err) {
      if (messageEl) showMessage(messageEl, err.message || 'Upload failed', 'error');
    }
  });
}

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (form) form.reset();
    pdfBase64 = null;
    pdfFileName = null;
    setPill('No PDF selected');
    if (messageEl) showMessage(messageEl, '', 'info');
  });
}