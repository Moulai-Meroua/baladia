document.addEventListener('DOMContentLoaded', () => {
  // Auth guard
  if (localStorage.getItem('adminSession') !== 'true') {
    window.location.href = 'admin.html';
    return;
  }

  loadStats();
  loadRequests();
  loadAppointments();

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderRequestsTable(searchRequests(searchInput.value));
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminSession');
      window.location.href = 'admin.html';
    });
  }
});

function loadStats() {
  const requests = getAllRequests();
  const appointments = getAllAppointments();
  const pending = requests.filter(r => r.status === 'pending').length;

  setEl('statRequests', requests.length);
  setEl('statAppointments', appointments.length);
  setEl('statPending', pending);
  setEl('statApproved', requests.filter(r => r.status === 'approved').length);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function loadRequests(query = '') {
  const data = query ? searchRequests(query) : getAllRequests();
  renderRequestsTable(data);
}

function renderRequestsTable(data) {
  const tbody = document.querySelector('#requestsTable tbody');
  if (!tbody) return;

  const docTypes = { birth: 'شهادة ميلاد', residence: 'شهادة إقامة', university: 'شهادة جامعية', civil: 'الحالة المدنية' };

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📭</div><p>لا توجد طلبات</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(r => {
    const sInfo = getStatusLabel(r.status);
    return `
      <tr class="new-row">
        <td><code style="font-size:0.78rem;background:var(--gray-100);padding:3px 7px;border-radius:4px">${r.id}</code></td>
        <td>${r.fullname || '—'}</td>
        <td>${docTypes[r.docType] || r.docType || '—'}</td>
        <td>${r.wilaya || '—'}</td>
        <td><span class="status-badge ${sInfo.class}">${sInfo.ar}</span></td>
        <td>
          <button class="action-btn approve" onclick="changeStatus('${r.id}','approved')">قبول</button>
          <button class="action-btn reject" onclick="changeStatus('${r.id}','rejected')" style="margin-right:4px">رفض</button>
        </td>
      </tr>`;
  }).join('');
}

function loadAppointments() {
  const appointments = getAllAppointments();
  const tbody = document.querySelector('#appointmentsTable tbody');
  if (!tbody) return;

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📅</div><p>لا توجد مواعيد</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.map(a => `
    <tr>
      <td><code style="font-size:0.78rem;background:var(--gray-100);padding:3px 7px;border-radius:4px">${a.id}</code></td>
      <td>${a.municipality || a.wilaya || '—'}</td>
      <td>${a.date || '—'}</td>
      <td>${a.time || '—'}</td>
    </tr>`).join('');
}

function changeStatus(id, status) {
  updateRequestStatus(id, status);
  loadStats();
  loadRequests();
  const labels = { approved: 'تم قبول الطلب', rejected: 'تم رفض الطلب' };
  showToast(labels[status] || 'تم التحديث', status === 'approved' ? 'success' : 'error');
}
