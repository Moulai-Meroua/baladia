function showToast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '🔔'}</span> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function searchRequests(query) {
  const requests = getAllRequests ? getAllRequests() : [];
  if (!query) return requests;
  return requests.filter(r =>
    (r.fullname && r.fullname.includes(query)) ||
    (r.id && r.id.includes(query)) ||
    (r.phone && r.phone.includes(query)) ||
    (r.nid && r.nid.includes(query))
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-DZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch { return dateStr; }
}
