/**
 * Materials page logic
 */

const subjectSearchInput = document.getElementById('subjectSearch');
const searchBtn = document.getElementById('searchBtn');
const grid = document.getElementById('materialsGrid');
const emptyState = document.getElementById('emptyState');

function cardHtml(material) {
  const subject = escapeHtml(material.subject_name || '');
  const unit = escapeHtml(material.unit_name || '');
  const question = escapeHtml(material.question || '');
  const answer = escapeHtml(material.answer || '');

  // pdf_url stored in DB as objectName.
  // For public bucket, we expect the backend storage to be configured as public.
  // We'll build a URL via Supabase public endpoint if SUPABASE_URL is set.
  const pdfUrl = material.pdf_url ? buildPublicPdfUrl(material.pdf_url) : null;

  const hasPdf = !!pdfUrl;

  const actions = hasPdf
    ? `
      <div class="card__actions">
        <button class="small-btn" type="button" data-action="view" data-id="${material.id}">View PDF</button>
        <button class="small-btn" type="button" data-action="download" data-id="${material.id}">Download PDF</button>
      </div>
    `
    : `
      <div class="card__actions">
        <span class="muted">No PDF provided</span>
      </div>
    `;

  // Basic formatting
  return `
    <article class="card" data-id="${material.id}">
      <h3>${subject}</h3>
      <div class="badges">
        <span class="badge">Unit: ${unit}</span>
      </div>
      <div>
        <div class="muted" style="font-weight:900;margin-bottom:6px">Important Questions</div>
        <pre class="pre">${question}</pre>
      </div>
      <div style="margin-top:10px">
        <div class="muted" style="font-weight:900;margin-bottom:6px">Answers</div>
        <pre class="pre">${answer}</pre>
      </div>
      ${actions}
    </article>
  `;
}

function buildPublicPdfUrl(objectName) {
  // If you configure the bucket as public, Supabase serves it via:
  // https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<object>
  // We need SUPABASE_URL-derived public endpoint.
  const supabaseUrl = window.SUPABASE_URL || '';
  const bucket = window.SUPABASE_PDF_BUCKET || 'question-pdfs';
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectName}`;
}

let allMaterials = [];

async function loadMaterials() {
  grid.innerHTML = '';
  emptyState.style.display = 'none';

  const { materials } = await apiGet('/api/materials');
  allMaterials = materials || [];
  renderMaterials(allMaterials);
}

function renderMaterials(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyState.style.display = 'block';
    return;
  }
  grid.innerHTML = list.map(cardHtml).join('');
}

function normalize(s) {
  return String(s || '').toLowerCase().trim();
}

searchBtn.addEventListener('click', () => {
  const q = normalize(subjectSearchInput.value);
  if (!q) return renderMaterials(allMaterials);
  const filtered = allMaterials.filter((m) => normalize(m.subject_name).includes(q));
  renderMaterials(filtered);
});

subjectSearchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const material = allMaterials.find((m) => String(m.id) === String(id));
  if (!material) return;

  const pdfUrl = material.pdf_url ? buildPublicPdfUrl(material.pdf_url) : null;

  if (btn.getAttribute('data-action') === 'view') {
    openPdf(pdfUrl);
  }
  if (btn.getAttribute('data-action') === 'download') {
    downloadPdf(pdfUrl, `${material.subject_name || 'material'}.pdf`);
  }
});

(async function init() {
  try {
    // Populate environment-like values (set in HTML if desired)
    // SUPABASE_URL: e.g. https://xyzcompany.supabase.co
    // SUPABASE_PDF_BUCKET: question-pdfs
    await loadMaterials();

    // auto-filter if query exists
    const subject = new URLSearchParams(window.location.search).get('subject');
    if (subject) {
      subjectSearchInput.value = subject;
      searchBtn.click();
    }
  } catch (err) {
    console.error(err);
    emptyState.style.display = 'block';
    emptyState.querySelector('.empty-state__title').textContent = 'Failed to load materials';
  }
})();

