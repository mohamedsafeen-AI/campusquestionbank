/**
 * Shared frontend helpers
 */

const API_BASE = (() => {
  // Supports local dev (e.g. http://localhost:5000) and Netlify.
  // You can override by defining window.API_BASE manually in HTML.
  if (window.API_BASE) return window.API_BASE;
  const env = (document.currentScript && document.currentScript.dataset && document.currentScript.dataset.apiBase) || null;
  if (env) return env;
  // Default: same origin.
  return '';
})();

function apiUrl(path) {
  if (!API_BASE) return `${path}`;
  const base = API_BASE.replace(/\/+$/, '');
  return `${base}${path}`;
}

function showMessage(el, msg, type = 'info') {
  el.textContent = msg;
  el.style.color = type === 'error' ? '#b91c1c' : (type === 'success' ? '#166534' : '');
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function openPdf(pdfUrl) {
  // Use a new tab for online viewing.
  if (!pdfUrl) return;
  window.open(pdfUrl, '_blank', 'noopener');
}

function downloadPdf(pdfUrl, fileName = 'material.pdf') {
  if (!pdfUrl) return;
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function apiGet(path) {
  const res = await fetch(apiUrl(path), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

async function apiPost(path, body, extraHeaders = {}) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  // 💡 இதை மட்டும் apiPost-க்கு கீழே புதிதாகச் சேர்க்கவும் (பழையதை நீக்க வேண்டாம்)

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}
// 76-வது வரியிலிருந்து இப்படி மாற்றவும்:
async function apiPostMultipart(path, formData, extraHeaders = {}) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      ...extraHeaders // இதைச் சேர்த்தால் தான் அட்மின் மின்னஞ்சல் சர்வருக்குச் செல்லும்
    },
    body: formData, 
  });
  
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

async function apiDelete(path, extraHeaders = {}) {
  const res = await fetch(apiUrl(path), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

