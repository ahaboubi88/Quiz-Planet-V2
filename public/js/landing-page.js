// Landing Page Interactions, Animations & Bilingual Support
const landingTranslations = {
    // Nav
    nav_features: { en: `Features`, ar: `المميزات` },
    nav_instructions: { en: `Instructions`, ar: `شرح الاستخدام` },
    nav_get_started: { en: `Get Started`, ar: `ابدأ الآن` },

    // Hero
    hero_title: { en: `The Ultimate <br> Local Quiz Platform`, ar: `منصة الاختبارات <br> المحلية الأفضل` },
    hero_subtitle: { en: `Engage your audience with real-time, Kahoot-style quizzes that run entirely on your local network. No internet? No problem.`, ar: `اجذب جمهورك باختبارات تفاعلية فورية بأسلوب كاهوت تعمل بالكامل على شبكتك المحلية. لا يوجد إنترنت؟ لا مشكلة.` },
    hero_cta_demo: { en: `Download Free Demo`, ar: `تحميل النسخة التجريبية` },
    hero_cta_instructions: { en: `Watch Instructions`, ar: `شاهد شرح الاستخدام` },
    hero_cta_features: { en: `Explore Features`, ar: `استكشف المميزات` },

    // Features
    features_title: { en: `Everything you need for the perfect quiz`, ar: `كل ما تحتاجه للاختبار المثالي` },
    features_subtitle: { en: `Designed for teachers, trainers, and event hosts who need reliability and speed.`, ar: `مصمم للمعلمين والمدربين ومنظمي الفعاليات الذين يحتاجون إلى الموثوقية والسرعة.` },
    f1_title: { en: `100% Offline`, ar: `أوفلاين 100%` },
    f1_desc: { en: `Run your entire event without an internet connection. Perfect for remote areas or restricted networks.`, ar: `قم بتشغيل فعاليتك بالكامل بدون اتصال بالإنترنت. مثالي للمناطق النائية أو الشبكات المقيدة.` },
    f2_title: { en: `Built-in Hotspot`, ar: `نقطة اتصال مدمجة` },
    f2_desc: { en: `Start a Wi-Fi hotspot directly from the app. Players connect their phones and play instantly.`, ar: `ابدأ نقطة اتصال Wi-Fi مباشرة من التطبيق. يتصل اللاعبون بهواتفهم ويلعبون فوراً.` },
    f3_title: { en: `Bilingual (AR/EN)`, ar: `ثنائي اللغة (عربي/إنجليزي)` },
    f3_desc: { en: `Full support for Arabic and English with RTL layouts. Reach every student in their language.`, ar: `دعم كامل للغتين العربية والإنجليزية مع تخطيطات RTL. تواصل مع كل طالب بلغتهم.` },
    f4_title: { en: `4 Question Types`, ar: `4 أنواع من الأسئلة` },
    f4_desc: { en: `Classic MCQ, True/False, Text Answer, and Puzzle Ordering. Keep the energy high with variety.`, ar: `الأسئلة التقليدية، صح/خطأ، الإجابة النصية، والترتيب. حافظ على الحماس مع التنوع.` },
    f5_title: { en: `Excel/JSON Import`, ar: `استيراد Excel/JSON` },
    f5_desc: { en: `Build quizzes in our editor or import them from Excel in seconds. Zero friction workflow.`, ar: `قم ببناء الاختبارات في المحرر الخاص بنا أو استوردها من Excel في ثوانٍ. سير عمل سلس للغاية.` },
    f6_title: { en: `Portable EXE`, ar: `ملف تشغيل محمول` },
    f6_desc: { en: `No installation, no dependencies. Just download the executable and you're ready to host.`, ar: `بدون تثبيت، وبدون تبعات. ما عليك سوى تحميل ملف التشغيل وأنت جاهز للاستضافة.` },

    // Gallery
    gallery_title: { en: `See it in Action`, ar: `شاهد التطبيق في الواقع` },
    gallery_c1: { en: `Organize your library`, ar: `نظم مكتبتك` },
    gallery_c2: { en: `Advanced Question Editor`, ar: `محرر أسئلة متطور` },
    gallery_c3: { en: `Beautiful Host Lobby`, ar: `واجهة انتظار رائعة` },

    // Pricing
    pricing_title: { en: `Choose Your Version`, ar: `اختر نسختك` },
    pricing_subtitle: { en: `Start for free or unlock the full potential of Quiz Planet.`, ar: `ابدأ مجاناً أو افتح كامل إمكانيات كويز بلانيت.` },
    p1_title: { en: `Free Demo`, ar: `النسخة التجريبية` },
    p1_price: { en: `$0`, ar: `0$` },
    p1_note: { en: `/forever`, ar: `/للأبد` },
    p1_l1: { en: `Max 4 Questions per Quiz`, ar: `بحد أقصى 4 أسئلة لكل اختبار` },
    p1_l2: { en: `Max 4 Players per Session`, ar: `بحد أقصى 4 لاعبين لكل جلسة` },
    p1_l3: { en: `Includes All Question Types`, ar: `يتضمن جميع أنواع الأسئلة` },
    p1_l4: { en: `Local Network Only`, ar: `الشبكة المحلية فقط` },
    p1_l5: { en: `Portable .exe included`, ar: `يتضمن ملف EXE المحمول` },
    p1_cta: { en: `Download Demo`, ar: `تحميل التجريبية` },
    p2_title: { en: `Full Version`, ar: `النسخة الكاملة` },
    p2_popular: { en: `MOST POPULAR`, ar: `الأكثر شيوعاً` },
    p2_price: { en: `$13`, ar: `13$` },
    p2_note: { en: `/one-time`, ar: `/لمرة واحدة` },
    p2_l1: { en: `Unlimited Questions`, ar: `أسئلة غير محدودة` },
    p2_l2: { en: `Unlimited Players`, ar: `لاعبون غير محدودون` },
    p2_l3: { en: `Online Multiplayer Support`, ar: `دعم اللعب المتعدد عبر الإنترنت` },
    p2_l4: { en: `Secure Tunnels Included`, ar: `قنوات اتصال آمنة` },
    p2_l5: { en: `Priority Support`, ar: `دعم فني ذو أولوية` },
    p2_cta: { en: `Get Full Access`, ar: `احصل على النسخة الكاملة` },

    // Footer
    footer_text: { en: `&copy; 2026 Quiz Planet. Produced and developed by Aymen Haboubi.`, ar: `&copy; 2026 كويز بلانيت. إنتاج وتطوير: أيمن الحبوبي.` },
    footer_sub: { en: `Proudly built for classrooms worldwide.`, ar: `بني بكل فخر لفصول الدراسة في جميع أنحاء العالم.` },

    // Reviews
    reviews_title: { en: `What our hosts say`, ar: `ماذا يقول مستخدمونا` },
    reviews_subtitle: { en: `Real feedback from teachers and organizers around the world.`, ar: `آراء وتجارب حقيقية من معلمين ومنظمين من جميع أنحاء العالم.` },
    review_form_title: { en: `Leave a Review`, ar: `اترك تقييمك` },
    review_name_ph: { en: `Your Name`, ar: `اسمك` },
    review_comment_ph: { en: `What did you think of Quiz Planet?`, ar: `ما رأيك في كويز بلانيت؟` },
    review_submit_btn: { en: `Post Review`, ar: `نشر التقييم` },
    review_success: { en: `Review submitted for approval!`, ar: `تم إرسال التقييم للمراجعة!` },
    review_error: { en: `Failed to submit review.`, ar: `فشل في إرسال التقييم.` },
    review_pending: { en: `Thank you! Your review is pending approval.`, ar: `شكراً لك! تقييمك قيد المراجعة حالياً.` },
    
    // Request Modal
    modal_title: { en: `Get Full Access`, ar: `الحصول على النسخة الكاملة` },
    contact_title: { en: `Payment & Contact`, ar: `الدفع والتواصل` },
    contact_subtitle: { en: `To complete your purchase and receive your key, please contact us via:`, ar: `لإكمال عملية الشراء واستلام الرمز الخاص بك، يرجى التواصل معنا عبر:` },
    phone_label: { en: `Phone/WhatsApp:`, ar: `الهاتف/واتساب:` },
    facebook_label: { en: `Facebook:`, ar: `فيسبوك:` },
    instagram_label: { en: `Instagram:`, ar: `إنستغرام:` },
    ph_full_name: { en: `Full Name`, ar: `الاسم الكامل` },
    ph_email: { en: `Email Address`, ar: `البريد الإلكتروني` },
    ph_phone: { en: `Phone Number`, ar: `رقم الهاتف` },
    ph_hwid: { en: `Your Machine HWID (from App)`, ar: `معرف الجهاز (HWID) الخاص بك` },
    btn_submit_request: { en: `Submit Request`, ar: `إرسال الطلب` },
    sending_msg: { en: `Sending...`, ar: `جاري الإرسال...` },

    // Dynamic Assets
    hero_img_src: { en: `/img/landing_page_en.png`, ar: `/img/landing_page_ar.png` }
};

let currentLang = localStorage.getItem('kahoot_lang') || 'en'; // Defaults to English for landing

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('kahoot_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (landingTranslations[key] && landingTranslations[key][lang]) {
            if (el.tagName === 'IMG') {
                el.src = landingTranslations[key][lang];
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = landingTranslations[key][lang];
            } else {
                el.innerHTML = landingTranslations[key][lang];
            }
        }
    });

    // Update Nav padding for RTL if needed (usually handled by flex-direction: row-reverse automatically)
    document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Check if running via file:// protocol (local file)
    if (window.location.protocol === 'file:') {
        alert("CRITICAL ERROR: You are opening the HTML file directly. The form will NOT work. You must access the page through the app (usually http://localhost:3000/landing.html).");
    }

    // 0. Init Language
    setLanguage(currentLang);
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });

    // 1. Intersection Observer for Scroll Reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Dynamic Navbar Background on Scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '0.8rem 0';
            nav.style.background = 'rgba(15, 23, 42, 0.9)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // 4. Button Feedback
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });
    });

    // 5. Review System Logic
    const starRating = document.getElementById('star-rating');
    const ratingInput = document.getElementById('rating-input');
    const reviewForm = document.getElementById('review-form');
    const reviewsFeed = document.getElementById('reviews-feed');

    // Star Click Handler
    if (starRating) {
        const stars = starRating.querySelectorAll('span');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                ratingInput.value = val;
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    s.style.color = sVal <= val ? '#f59e0b' : 'var(--text-muted)';
                });
            });

            star.addEventListener('mouseover', () => {
                const val = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    if (sVal <= val) s.style.transform = 'scale(1.2)';
                });
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.style.transform = '');
            });
        });
    }

    // Load Approved Reviews
    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            if (data.length === 0) {
                reviewsFeed.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No reviews yet. Be the first!</p>`;
                return;
            }
            reviewsFeed.innerHTML = data.map(r => `
                <div class="glass" style="padding: 20px; border-radius: 15px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="color: #f59e0b; font-size: 1.2rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    <p style="font-style: italic;">"${r.comment}"</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; font-size: 0.85rem; color: var(--text-muted);">
                        <strong>${r.author_name}</strong>
                        <span>${new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.error('Error loading reviews:', err);
        }
    };

    fetchReviews();

    // Submit Review Handler
    reviewForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = parseInt(ratingInput.value);
        if (rating === 0) {
            alert(currentLang === 'en' ? 'Please select a star rating!' : 'الرجاء اختيار التقييم بالنجوم!');
            return;
        }

        const formData = {
            author_name: document.getElementById('reviewer-name').value,
            comment: document.getElementById('reviewer-comment').value,
            rating: rating
        };

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                alert(landingTranslations.review_pending[currentLang]);
                reviewForm.reset();
                ratingInput.value = 0;
                document.querySelectorAll('#star-rating span').forEach(s => s.style.color = 'var(--text-muted)');
            }
        } catch (err) {
            alert(landingTranslations.review_error[currentLang]);
        }
    });

    // 6. Analytics Tracking
    const trackEvent = async (type) => {
        try {
            await fetch('/api/stats/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_type: type })
            });
        } catch (e) {}
    };

    document.querySelectorAll('a[href="#pricing"], .btn-outline[data-i18n="p1_cta"]').forEach(btn => {
        btn.addEventListener('click', () => trackEvent('click_download_demo'));
    });
    document.querySelectorAll('.featured .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => trackEvent('click_purchase_full'));
    });
});

/**
 * License Request Modal Logic
 */
function openRequestModal() {
    document.getElementById('request-modal').style.display = 'flex';
}

function closeRequestModal() {
    document.getElementById('request-modal').style.display = 'none';
}

// Form Handler
document.getElementById('license-request-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('req-status');
    const name = document.getElementById('req-name').value;
    const email = document.getElementById('req-email').value;
    const phone = document.getElementById('req-phone').value;
    const hwid = document.getElementById('req-hwid').value;

    statusEl.innerText = landingTranslations.sending_msg[currentLang];
    statusEl.style.display = 'block';
    statusEl.style.color = 'white';

    try {
        const res = await fetch('/api/license/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, hwid })
        });
        const data = await res.json();
        if (data.success) {
            statusEl.innerText = data.message;
            statusEl.style.color = '#10b981';
            e.target.reset();
            setTimeout(closeRequestModal, 5000);
        } else {
            statusEl.innerText = data.error || 'Failed to send request.';
            statusEl.style.color = '#ef4444';
        }
    } catch (err) {
        console.error('Fetch error:', err);
        statusEl.innerText = 'Network error: ' + err.message;
        statusEl.style.color = '#ef4444';
    }
});
