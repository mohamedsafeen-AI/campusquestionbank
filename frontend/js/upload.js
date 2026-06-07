/**
 * Upload page logic - Final Corrected Version with Absolute Vercel URL
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
      // 1. HTML எலமெண்ட்களில் இருந்து பாதுகாப்பாக மதிப்புகளை எடுக்கிறோம்
      const adminEmailEl = document.getElementById('adminEmail') || document.getElementById('admin_email');
      const subjectEl    = document.getElementById('subject') || document.getElementById('subjectName') || document.getElementById('subject_name');
      const unitEl       = document.getElementById('unit') || document.getElementById('unitName') || document.getElementById('unit_name');
      const questionsEl  = document.getElementById('questions') || document.getElementById('question');
      const answersEl    = document.getElementById('answers') || document.getElementById('answer');

      const adminEmail  = adminEmailEl ? adminEmailEl.value.trim() : 'admin@gmail.com';
      const subjectName = subjectEl ? subjectEl.value.trim() : '';
      const unitName    = unitEl ? unitEl.value.trim() : '';
      const questions   = questionsEl ? questionsEl.value.trim() : '';
      const answers     = answersEl ? answersEl.value.trim() : '';

      if (!subjectName) throw new Error('Subject Name is required.');

      // 2. சர்வருக்கு அனுப்ப வேண்டிய தரவு அமைப்பு
      // 2. சர்வருக்கு அனுப்ப வேண்டிய தரவு அமைப்பு (கீ பெயர்களை மட்டும் கவனமாக மாற்றியுள்ளேன்)
      // 2. சர்வர் எதிர்பார்க்கும் அனைத்து ஃபீல்டுகளையும் கச்சிதமாக அனுப்பும் பகுதி
     // 2. சர்வர் எதிர்பார்க்கும் அனைத்து ஃபீல்டுகளையும் அனுப்புகிறோம்
      // 2. சர்வர் எதிர்பார்க்கும் FormData முறை
// FormData-வை இப்படித் திருத்தி அமையுங்கள்:
// upload.js-ல் இந்த பகுதியை மட்டும் மாற்றவும்:
// 74-வது வரியிலிருந்து இதை மாற்றவும்:
// upload.js-ல் இந்த பகுதியை மட்டும் மாற்றவும்:
const payload = {
    subject_name: subjectName,
    unit_name: unitName,
    question: questions,
    answer: answers
    // admin_email-ஐ நீக்கிவிட்டோம், ஏனெனில் அது ஹெடரில் ஏற்கனவே செல்கிறது!
};

if (pdfBase64) {
    payload.pdf_base64 = pdfBase64;
    payload.pdf_file_name = pdfFileName;
}
// 87-வது வரியை மாற்றுங்கள்:
const res = await apiPost('https://campusquestionbank-yyz4.vercel.app/api/upload', payload, { 'X-Admin-Email': adminEmail });
      // 4. அப்லோடு வெற்றியடைந்தால் ஃபார்மை ரீசெட் செய்கிறோம்
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