const translations = {
  ar: {
    gov_title: "الجمهورية الجزائرية الديمقراطية الشعبية",
    platform_subtitle: "منصة البلدية الرقمية",
    platform_subtitle_fr: "Plateforme numérique de la commune",
    hero_badge: "🇩🇿 خدمات رقمية موثوقة",
    hero_title: "مرحبا بكم في المنصة الرقمية للبلدية",
    hero_subtitle: "خدمات رقمية لتسهيل حياتكم اليومية",
    services_title: "الخدمات المتاحة",
    service_request: "طلب الوثائق",
    service_tracking: "تتبع الطلبات",
    service_appointments: "حجز المواعيد",
    service_admin: "لوحة الإدارة",
    stats_title: "إحصائيات المنصة",
    stats_requests: "طلبات معالجة",
    stats_appointments: "مواعيد محجوزة",
    stats_users: "مواطن مسجل",
    stats_municipalities: "بلدية مشاركة",
    faq_title: "الأسئلة الشائعة",
    faq_q1: "كيف أطلب شهادة الميلاد؟",
    faq_a1: 'يمكنك تقديم طلب عبر قسم "طلب الوثائق" في الصفحة الرئيسية، ثم اختيار نوع الوثيقة وتعبئة البيانات المطلوبة.',
    faq_q2: "كيف أتتبع طلبي؟",
    faq_a2: 'استخدم رقم الطلب الذي وصلك بعد التسجيل في قسم "تتبع الطلبات" للاطلاع على الحالة الراهنة.',
    faq_q3: "هل يمكنني حجز موعد عبر الإنترنت؟",
    faq_a3: 'نعم، يمكنك حجز موعد في أي بلدية عبر قسم "حجز المواعيد" واختيار التاريخ والوقت المناسبين.',
    footer_text: "© 2026 الجمهورية الجزائرية الديمقراطية الشعبية — وزارة الداخلية",
  },
  fr: {
    gov_title: "République Algérienne Démocratique et Populaire",
    platform_subtitle: "Plateforme numérique de la commune",
    platform_subtitle_fr: "Plateforme numérique de la commune",
    hero_badge: "🇩🇿 Services numériques fiables",
    hero_title: "Bienvenue sur la plateforme numérique de la commune",
    hero_subtitle: "Des services numériques pour faciliter votre quotidien",
    services_title: "Services disponibles",
    service_request: "Demande de documents",
    service_tracking: "Suivi des demandes",
    service_appointments: "Prise de rendez-vous",
    service_admin: "Tableau de bord",
    stats_title: "Statistiques",
    stats_requests: "Demandes traitées",
    stats_appointments: "Rendez-vous réservés",
    stats_users: "Citoyen inscrit",
    stats_municipalities: "Commune participante",
    faq_title: "Questions fréquentes",
    faq_q1: "Comment demander un acte de naissance ?",
    faq_a1: 'Soumettez une demande via la section "Demande de documents", choisissez le type de document et remplissez les informations requises.',
    faq_q2: "Comment suivre ma demande ?",
    faq_a2: 'Utilisez le numéro de demande reçu après l\'enregistrement dans la section "Suivi des demandes".',
    faq_q3: "Puis-je prendre rendez-vous en ligne ?",
    faq_a3: 'Oui, via la section "Prise de rendez-vous", choisissez la commune, la date et l\'heure souhaitées.',
    footer_text: "© 2026 République Algérienne Démocratique et Populaire — Ministère de l'Intérieur",
  },
  en: {
    gov_title: "People's Democratic Republic of Algeria",
    platform_subtitle: "Municipal Digital Platform",
    platform_subtitle_fr: "Municipal Digital Platform",
    hero_badge: "🇩🇿 Trusted digital services",
    hero_title: "Welcome to the Municipal Digital Platform",
    hero_subtitle: "Digital services to simplify your daily life",
    services_title: "Available Services",
    service_request: "Document Requests",
    service_tracking: "Track Requests",
    service_appointments: "Book Appointments",
    service_admin: "Admin Panel",
    stats_title: "Platform Statistics",
    stats_requests: "Processed requests",
    stats_appointments: "Booked appointments",
    stats_users: "Registered citizen",
    stats_municipalities: "Participating municipality",
    faq_title: "Frequently Asked Questions",
    faq_q1: "How do I request a birth certificate?",
    faq_a1: 'Submit a request through the "Document Requests" section, select the document type and fill in the required information.',
    faq_q2: "How do I track my request?",
    faq_a2: 'Use the request number you received after registration in the "Track Requests" section to check the current status.',
    faq_q3: "Can I book an appointment online?",
    faq_a3: 'Yes, through the "Book Appointments" section, choose the municipality, date, and time that suits you.',
    footer_text: "© 2026 People's Democratic Republic of Algeria — Ministry of Interior",
  }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const isRTL = (lang === 'ar');
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  translatePage(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function translatePage(lang) {
  const t = translations[lang] || translations['ar'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});
