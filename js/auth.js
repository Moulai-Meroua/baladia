document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (localStorage.getItem('adminSession') === 'true' && document.getElementById('loginForm')) {
    window.location.href = 'dashboard.html';
  }

  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const btn = form.querySelector('button[type=submit]');
    const msg = document.getElementById('loginMessage');

    btn.textContent = '...جاري التحقق';
    btn.disabled = true;

    setTimeout(() => {
      if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('adminUser', user);
        showToast('مرحباً بك في لوحة الإدارة', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 600);
      } else {
        msg.innerHTML = '<div class="result-card error" style="margin-top:14px"><h3>❌ بيانات الدخول غير صحيحة</h3><p>يرجى التحقق من اسم المستخدم وكلمة المرور.</p></div>';
        btn.textContent = 'تسجيل الدخول';
        btn.disabled = false;
      }
    }, 800);
  });
});
