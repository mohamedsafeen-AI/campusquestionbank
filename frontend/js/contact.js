/**
 * Contact page logic
 */

const form = document.getElementById('contactForm');
const messageEl = document.getElementById('contactMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage(messageEl, 'Sending message...', 'info');

  try {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const res = await apiPost('/api/contact', { name, email, message });
    showMessage(messageEl, res.message || 'Sent!', 'success');
    form.reset();
  } catch (err) {
    showMessage(messageEl, err.message || 'Failed to send.', 'error');
  }
});

