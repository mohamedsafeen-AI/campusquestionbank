/**
 * Optional config bridge.
 *
 * Set these globals at runtime (for example in Netlify/Vercel environment variables,
 * or hardcode temporarily for local testing).
 *
 * Example:
 *   window.SUPABASE_URL = 'https://xxxx.supabase.co';
 *   window.SUPABASE_PDF_BUCKET = 'question-pdfs';
 */

window.SUPABASE_PDF_BUCKET = window.SUPABASE_PDF_BUCKET || 'question-pdfs';

