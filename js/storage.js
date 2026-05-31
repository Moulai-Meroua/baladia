// LocalStorage management for requests and appointments

function saveRequest(request) {
  let requests = JSON.parse(localStorage.getItem('baladiya_requests')) || [];
  request.id = 'REQ' + Date.now();
  request.status = 'pending';
  request.date = new Date().toLocaleDateString('ar-DZ');
  requests.push(request);
  localStorage.setItem('baladiya_requests', JSON.stringify(requests));
  return request.id;
}

function getAllRequests() {
  return JSON.parse(localStorage.getItem('baladiya_requests')) || [];
}

function getRequestById(id) {
  return getAllRequests().find(r => r.id === id);
}

function updateRequestStatus(id, status) {
  let requests = getAllRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx !== -1) {
    requests[idx].status = status;
    localStorage.setItem('baladiya_requests', JSON.stringify(requests));
    return true;
  }
  return false;
}

function saveAppointment(appointment) {
  let appointments = JSON.parse(localStorage.getItem('baladiya_appointments')) || [];
  appointment.id = 'APP' + Date.now();
  appointments.push(appointment);
  localStorage.setItem('baladiya_appointments', JSON.stringify(appointments));
  return appointment.id;
}

function getAllAppointments() {
  return JSON.parse(localStorage.getItem('baladiya_appointments')) || [];
}

function getStatusLabel(status) {
  const labels = {
    pending: { ar: 'قيد المعالجة', fr: 'En traitement', en: 'Pending', class: 'status-pending' },
    approved: { ar: 'مقبول', fr: 'Approuvé', en: 'Approved', class: 'status-approved' },
    rejected: { ar: 'مرفوض', fr: 'Rejeté', en: 'Rejected', class: 'status-rejected' }
  };
  return labels[status] || labels['pending'];
}
