let wilayasData = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Loading screen
  const loading = document.getElementById('loading-screen');
  if (loading) {
    setTimeout(() => loading.classList.add('hidden'), 1200);
  }

  // Dark mode
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', document.body.classList.contains('dark'));
      darkToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
    if (localStorage.getItem('darkMode') === 'true') darkToggle.textContent = '☀️';
  }

  // Animated counters
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 80);
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      counter.textContent = count.toLocaleString('ar-DZ');
      if (count >= target) clearInterval(interval);
    }, 20);
  });

  // Load wilayas data
  try {
    const res = await fetch('assets/wilayas.json');
    wilayasData = await res.json();
  } catch (e) {
    console.warn('Could not load wilayas.json', e);
  }

  // Request form
  const requestForm = document.getElementById('requestForm');
  if (requestForm) {
    requestForm.addEventListener('submit', e => {
      e.preventDefault();
      const fullname = document.getElementById('fullname').value.trim();
      const nid = document.getElementById('nid').value.trim();
      const phone = document.getElementById('phone').value.trim();

      if (nid.length !== 18 || !/^\d+$/.test(nid)) {
        showToast('الرقم الوطني يجب أن يتكون من 18 رقماً', 'error');
        return;
      }
      if (phone.length < 9) {
        showToast('رقم الهاتف غير صحيح', 'error');
        return;
      }

      const request = {
        fullname,
        nid,
        phone,
        wilaya: document.getElementById('wilaya').value,
        municipality: document.getElementById('municipality') ? document.getElementById('municipality').value : '',
        docType: document.getElementById('docType').value,
        notes: document.getElementById('notes') ? document.getElementById('notes').value : '',
      };

      const id = saveRequest(request);
      showToast('تم إرسال الطلب بنجاح!', 'success');

      const resultDiv = document.getElementById('requestResult');
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="result-card success">
            <h3>✅ تم تسجيل طلبك بنجاح</h3>
            <p>احتفظ برقم الطلب لتتبع حالته:</p>
            <div class="result-id">${id}</div>
            <p style="margin-top:14px; font-size:0.85rem; color:var(--text-muted)">يمكنك متابعة طلبك عبر صفحة <a href="tracking.html" style="color:var(--green)">تتبع الطلبات</a></p>
          </div>`;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
      }
      requestForm.reset();
    });
  }

  // Tracking form
  const trackingForm = document.getElementById('trackingForm');
  if (trackingForm) {
    trackingForm.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('requestId').value.trim().toUpperCase();
      const req = getRequestById(id);
      const resultDiv = document.getElementById('trackingResult');
      if (req) {
        const statusInfo = getStatusLabel(req.status);
        const docTypes = { birth: 'شهادة ميلاد', residence: 'شهادة إقامة', university: 'شهادة جامعية', civil: 'الحالة المدنية' };
        resultDiv.innerHTML = `
          <div class="result-card success">
            <h3>📋 معلومات الطلب</h3>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:0.95rem;">
              <tr><td style="padding:8px 0;color:var(--text-muted);width:40%">رقم الطلب</td><td><strong>${req.id}</strong></td></tr>
              <tr><td style="padding:8px 0;color:var(--text-muted)">الاسم</td><td>${req.fullname}</td></tr>
              <tr><td style="padding:8px 0;color:var(--text-muted)">نوع الوثيقة</td><td>${docTypes[req.docType] || req.docType}</td></tr>
              <tr><td style="padding:8px 0;color:var(--text-muted)">الولاية</td><td>${req.wilaya}</td></tr>
              <tr><td style="padding:8px 0;color:var(--text-muted)">تاريخ الطلب</td><td>${req.date || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:var(--text-muted)">الحالة</td><td><span class="status-badge ${statusInfo.class}">${statusInfo.ar}</span></td></tr>
            </table>
          </div>`;
      } else {
        resultDiv.innerHTML = `
          <div class="result-card error">
            <h3>❌ لم يتم العثور على الطلب</h3>
            <p>تحقق من رقم الطلب وأعد المحاولة.</p>
          </div>`;
      }
    });
  }

  // Appointment form
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    // Set min date to today
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    appointmentForm.addEventListener('submit', e => {
      e.preventDefault();
      const wilaya = document.getElementById('apptWilaya') ? document.getElementById('apptWilaya').value : '';
      const municipality = document.getElementById('apptMunicipality') ? document.getElementById('apptMunicipality').value : '';
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;

      if (!date || !time) { showToast('يرجى تحديد التاريخ والوقت', 'error'); return; }

      const appointment = { wilaya, municipality, date, time };
      const id = saveAppointment(appointment);
      showToast('تم حجز الموعد بنجاح!', 'success');

      const resultDiv = document.getElementById('appointmentResult');
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="result-card success">
            <h3>✅ تم حجز موعدك بنجاح</h3>
            <p>رقم الموعد: <strong class="result-id" style="font-size:1.2rem">${id}</strong></p>
            <p style="margin-top:10px;color:var(--text-muted);font-size:0.9rem">📅 ${date} — 🕐 ${time}</p>
            ${municipality ? `<p style="color:var(--text-muted);font-size:0.9rem">📍 ${municipality}، ${wilaya}</p>` : ''}
          </div>`;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
      }
      appointmentForm.reset();
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // Wilaya population for request form
  const wilayaSelect = document.getElementById('wilaya');
  if (wilayaSelect && Object.keys(wilayasData).length > 0) {
    wilayaSelect.addEventListener('change', () => populateMunicipalities('wilaya', 'municipality'));
  }

  // Appointment wilaya
  const apptWilaya = document.getElementById('apptWilaya');
  if (apptWilaya && Object.keys(wilayasData).length > 0) {
    apptWilaya.addEventListener('change', () => populateMunicipalities('apptWilaya', 'apptMunicipality'));
  }
});

function populateMunicipalities(wilayaId = 'wilaya', municipalityId = 'municipality') {
  const wilaya = document.getElementById(wilayaId)?.value;
  const mSelect = document.getElementById(municipalityId);
  if (!mSelect) return;
  mSelect.innerHTML = '<option value="">-- اختر البلدية --</option>';
  if (wilayasData[wilaya]) {
    wilayasData[wilaya].forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      mSelect.appendChild(opt);
    });
  }
}
