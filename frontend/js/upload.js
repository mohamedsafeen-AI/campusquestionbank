/**
 * Upload page logic (Fixed ID and Key mapping)
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
      pdfBase64 = reader.result; // PDF-ஐ Base64 டெக்ஸ்ட்டாக மாற்றுகிறது
      setPill(`Selected: ${file.name}`);
    };
    reader.readAsDataURL(file);
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage(messageEl, 'Uploading...', 'info');

    try {
      // 💡 உங்களுடைய HTML படிவத்தில் இருக்கும் அசல் ID-களுக்கு ஏற்ப மாற்றப்பட்டுள்ளது:
      const adminEmail = document.getElementById('adminEmail') ? document.getElementById('adminEmail').value.trim() : 'admin@gmail.com'; // இமெயில் ஃபீல்டு இல்லை என்றால் டிஃபால்ட்
      const subjectName = document.getElementById('subject').value.trim(); // ID: subject
      const unitName = document.getElementById('unit').value.trim();       // ID: unit
      const questions = document.getElementById('questions').value.trim(); // ID: questions
      const answers = document.getElementById('answers').value.trim();     // ID: answers

      if (!subjectName) throw new Error('Subject Name is required.');

      // 🚀 பேக்எண்ட் எதிர்பார்க்கும் சரியான ஸ்ட்ரக்சர்
      const payload = {
        subject_name: subjectName,
        unit_name: unitName,
        questions: questions, // சர்வருக்கு 'questions' ஆகப் போகிறது
        answers: answers,     // சர்வருக்கு 'answers' ஆகப் போகிறது
      };

      if (pdfBase64) {
        payload.pdf_base64 = pdfBase64;
        payload.pdf_file_name = pdfFileName;
      }

      // உங்களுடைய பழைய நம்பகமான apiPost ஃபங்ஷனையே பயன்படுத்துகிறோம்
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
}

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (form) form.reset();
    pdfBase64 = null;
    pdfFileName = null;
    setPill('No PDF selected');
    showMessage(messageEl, '', 'info');
  });
}