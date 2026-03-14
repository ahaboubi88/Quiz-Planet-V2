/**
 * i18n Dictionary and Translation Engine
 * Default: Arabic (ar), supported: English (en)
 */

const translations = {
    // --- Global / Common ---
    language_en: { en: 'English', ar: 'English' },
    language_ar: { en: 'العربية', ar: 'العربية' },
    cancel: { en: 'Cancel', ar: 'إلغاء' },
    delete: { en: 'Delete', ar: 'حذف' },
    edit: { en: 'Edit', ar: 'تعديل' },
    yes: { en: 'Yes', ar: 'نعم' },
    no: { en: 'No', ar: 'لا' },
    footer_credit: { en: 'Created by Aymen Haboubi', ar: 'إنتاج وتطوير : أيمن الحبوبي' },
    connection_connected: { en: 'Connected', ar: 'متصل' },
    connection_disconnected: { en: 'Disconnected', ar: 'مفصول' },
    connection_error: { en: 'Connection error', ar: 'خطأ في الاتصال' },
    connection_connecting: { en: 'Connecting...', ar: 'جاري الاتصال...' },
    loading_quizzes: { en: 'Loading quizzes...', ar: 'جاري تحميل الاختبارات...' },
    
    // --- Activator ---
    app_activator: { en: 'App Activator', ar: 'مُفعّل التطبيق' },
    checking_license: { en: 'Checking license...', ar: 'جاري التحقق من الترخيص...' },
    machine_hwid: { en: 'Your Machine ID (HWID)', ar: 'معرف جهازك (HWID)' },
    send_id_msg: { en: 'Send this ID to us to get your activation key.', ar: 'أرسل لنا هذا المعرف للحصول على مفتاح التفعيل الخاص بك.' },
    activation_key: { en: 'Activation Key', ar: 'مفتاح التفعيل' },
    activation_key_ph: { en: 'XXXX-XXXX-XXXX', ar: 'رمز التفعيل هنا' },
    activate_installed: { en: 'Activate Installed Version', ar: 'تفعيل النسخة المثبتة' },
    portable_version: { en: 'Portable Version', ar: 'النسخة المحمولة' },
    authorize_portable_msg: { en: 'Authorize your portable copy here.', ar: 'قم بترخيص نسختك المحمولة من هنا.' },
    choose_portable_folder: { en: '📂 Choose Portable Folder', ar: '📂 اختر مجلد النسخة المحمولة' },
    authorize_portable_btn: { en: '✅ Authorize Portable', ar: '✅ ترخيص النسخة المحمولة' },
    activate_portable_version: { en: '📱 Activate Portable Version', ar: '📱 تفعيل النسخة المحمولة' },
    back_to_home: { en: '← Back to Home', ar: '→ العودة للرئيسية' },
    demo_mode_badge: { en: 'DEMO MODE', ar: 'النسخة التجريبية' },
    demo_mode_activate: { en: 'DEMO MODE - ACTIVATE', ar: 'نسخة تجريبية - تفعيل' },
    activated_badge: { en: '✅ ACTIVATED', ar: '✅ مفعل بنجاح' },
    not_activated_badge: { en: 'NOT ACTIVATED', ar: 'غير مفعل' },
    hwid_copied: { en: 'HWID copied to clipboard!', ar: 'تم نسخ الـ HWID للحافظة!' },
    enter_key_alert: { en: 'Please enter a key', ar: 'الرجاء إدخال رمز التفعيل' },
    activation_service_unavailable: { en: 'Activation service unavailable', ar: 'خدمة التفعيل غير متوفرة حالياً' },
    folder_picker_error: { en: 'Could not open folder picker.', ar: 'تعذر فتح اختيار المجلد.' },
    no_folder_selected: { en: 'No folder selected', ar: 'لم يتم اختيار مجلد' },
    failed_authorize_portable: { en: 'Failed to authorize portable version', ar: 'فشل ترخيص النسخة المحمولة' },
    folder_selected_label: { en: 'Selected: ', ar: 'المجلد المختار: ' },
    admin_access_required: { en: "Administrator access required to toggle hotspot.\nPlease restart 'Quiz Planet.exe' as Administrator.", ar: "يتطلب تشغيل نقطة الاتصال صلاحيات المسؤول.\nيرجى إعادة تشغيل البرنامج كمسؤول." },
    toast_activated: { en: 'Software activated successfully!', ar: 'تم تفعيل البرنامج بنجاح!' },
    license_expired_portable: { en: 'When it expires, re-authorize from the installed version.', ar: 'عند انتهاء الصلاحية، قم بإعادة الترخيص من النسخة المثبتة.' },
    portable_activated_days: { en: 'This portable copy is authorized for <strong>{days} more days</strong>.', ar: 'هذه النسخة المحمولة مرخصة لمدة <strong>{days} أيام أخرى</strong>.' },
    portable_activated_title: { en: 'Portable Version Activated', ar: 'النسخة المحمولة مفعلة' },
    portable_instructions_title: { en: 'Activation Required', ar: 'التفعيل مطلوب' },
    portable_instruction_1: { en: 'Open the <strong>installed version</strong> of Quiz Planet on your PC', ar: 'افتح <strong>النسخة المثبتة</strong> من اللعبة على حاسوبك' },
    portable_instruction_2: { en: 'Click the green <strong>"📱 Activate Portable"</strong> button', ar: 'انقر على الزر الأخضر <strong>"📱 تفعيل النسخة المحمولة"</strong>' },
    portable_instruction_3: { en: 'Click <strong>"Activate Portable Version"</strong> in the activator page', ar: 'انقر على <strong>"تفعيل النسخة المحمولة"</strong> في صفحة التفعيل' },
    portable_instruction_4: { en: 'Choose the folder containing this portable version', ar: 'اختر المجلد الذي يحتوي على هذه النسخة المحمولة' },
    portable_instruction_5: { en: 'A <code>license.qp</code> file will be created — restart this portable app', ar: 'سيتم إنشاء ملف <code>license.qp</code> — أعد تشغيل هذه النسخة المحمولة' },
    to_activate_portable: { en: 'To activate this portable version:', ar: 'لتفعيل هذه النسخة المحمولة:' },
    days_suffix: { en: ' days', ar: ' يوم' },
    err_invalid_key: { en: 'Invalid activation key for this machine.', ar: 'رمز التفعيل غير صالح لهذا الجهاز.' },
    err_not_activated_host: { en: 'Only activated installations can authorize portable versions.', ar: 'يجب تفعيل النسخة المثبتة أولاً لترخيص النسخ المحمولة.' },
    err_invalid_path: { en: 'Invalid target path.', ar: 'مسار المجلد غير صالح.' },
    err_clock_rollback: { en: 'System clock rollback detected. Please correct your date and time to continue.', ar: 'تم اكتشاف تلاعب في وقت النظام. يرجى تصحيح التاريخ والوقت للمتابعة.' },
    clock_error_badge: { en: 'CLOCK ERROR', ar: 'خطأ في الوقت' },
    success_portable_created: { en: 'License created successfully!', ar: 'تم إنشاء الترخيص بنجاح!' },
    license_expiring: { en: 'License Expiring Soon!', ar: 'شارفت صلاحية الترخيص على الانتهاء!' },
    btn_renew_now: { en: 'Renew/Activate Now', ar: 'جدد / فعل الآن' },
    license_banner_prefix: { en: 'Your portable license expires in ', ar: 'تنتهي صلاحية النسخة المحمولة بعد ' },
    license_banner_suffix: { en: ' days. Please reconnect to your primary installation to renew.', ar: ' يوم. يرجى إعادة الاتصال بالنسخة المثبتة للتجديد.' },
    default_time: { en: '⌚ Default:', ar: '⌚ الافتراضي:' },
    btn_apply_time: { en: 'Apply All', ar: 'تطبيق للكل' },
    confirm_are_you_sure: { en: 'Are you sure?', ar: 'هل أنت متأكد؟' },
    host_results: { en: 'Results', ar: 'النتائج' },
    host_show_leaderboard: { en: 'Show Leaderboard', ar: 'عرض قائمة المتصدرين' },
    host_leaderboard: { en: 'Leaderboard', ar: 'قائمة المتصدرين' },
    answered_count: { en: 'answered', ar: 'أجابوا' },
    host_answers_submitted: { en: 'Answers Submitted', ar: 'الإجابات المقدمة' },
    game_over: { en: 'Game Over!', ar: 'انتهت اللعبة!' },
    host_auto_progress: { en: 'Auto-next (5s)', ar: 'متابعة تلقائية (5ث)' },

    // --- Index / Landing Page ---
    home_title: { en: 'Quiz Planet', ar: 'Quiz بلا نت' },
    home_subtitle: { en: 'Learn and Play Together', ar: 'العب وتعلم معاً' },
    btn_join_game: { en: 'Join Game', ar: 'انضمام للعبة' },
    btn_host_game: { en: 'Host Game', ar: 'استضافة لعبة' },
    btn_create_quiz: { en: 'Create Quiz', ar: 'إنشاء اختبار' },

    // --- Player Page ---
    join_enter_pin: { en: 'Enter Game PIN', ar: 'أدخل رمز اللعبة (PIN)' },
    join_enter_nickname: { en: 'Enter Nickname', ar: 'أدخل اسمك المعرف' },
    join_choose_avatar: { en: 'Choose an Avatar', ar: 'اختر شخصية' },
    btn_join: { en: 'Join', ar: 'انضمام' },
    joining: { en: 'Joining...', ar: 'جاري الانضمام...' },
    error_pin_digits: { en: 'PIN must be 6 digits', ar: 'يجب أن يتكون الرمز من 6 أرقام' },
    error_enter_nickname: { en: 'Enter a nickname', ar: 'الرجاء إدخال الاسم' },
    error_host_disconnected: { en: 'Host disconnected — game over', ar: 'تم فصل المضيف — انتهت اللعبة' },
    error_no_connection: { en: 'Cannot connect to server. Check your Wi-Fi.', ar: 'لا يمكن الاتصال بالخادم. تحقق من شبكة Wi-Fi.' },
    error_join_timeout: { en: 'Connection timed out. Please try again.', ar: 'انتهت مهلة الاتصال. حاول مرة أخرى.' },
    error_demo_limit: { en: 'Demo version is limited to 4 players. Please upgrade to the full version.', ar: 'النسخة التجريبية مقيدة بـ 4 لاعبين فقط. الرجاء الترقية للنسخة الكاملة.' },
    error_game_not_found: { en: 'Game not found. Check the PIN.', ar: 'لم يتم العثور على اللعبة. تحقق من الرمز.' },
    waiting_title: { en: 'You\'re in!', ar: 'أنت في اللعبة!' },
    waiting_subtitle: { en: 'See your nickname on screen', ar: 'شاهد اسمك على الشاشة' },
    get_ready: { en: 'Get Ready!', ar: 'استعد!' },
    btn_submit: { en: 'Submit', ar: 'إرسال' },
    btn_submit_order: { en: 'Submit Order', ar: 'إرسال الترتيب' },
    answer_submitted: { en: 'Answer submitted!', ar: 'تم إرسال الإجابة!' },
    type_answer_placeholder: { en: 'Type your answer...', ar: 'اكتب إجابتك هنا...' },
    feedback_correct: { en: 'Correct!', ar: 'إجابة صحيحة!' },
    feedback_wrong: { en: 'Wrong!', ar: 'إجابة خاطئة!' },
    feedback_points: { en: 'pts', ar: 'نقطة' },
    feedback_total: { en: 'Total:', ar: 'المجموع:' },
    feedback_rank: { en: 'Rank:', ar: 'المركز:' },
    final_score: { en: 'points', ar: 'نقطة' },
    stat_correct: { en: 'Correct', ar: 'صحيحة' },
    feedback_streak: { en: 'in a row!', ar: 'على التوالي!' },
    feedback_streak_bonus: { en: 'in a row!', ar: 'على التوالي!' },
    feedback_bonus: { en: 'bonus', ar: 'إضافي' },

    // --- Host Page ---
    host_select_quiz: { en: 'Select a quiz to host:', ar: 'اختر اختباراً لاستضافته:' },
    btn_start_game: { en: 'Start Game', ar: 'بدء اللعبة' },
    setting_music: { en: 'Lobby Music', ar: 'موسيقى الانتظار' },
    setting_display_mode: { en: 'Display Mode', ar: 'وضع العرض' },
    setting_mode_classic: { en: 'Classic Mode — Players see shapes only', ar: 'الوضع الكلاسيكي — يرى اللاعبون الأشكال فقط' },
    setting_mode_full: { en: 'Full Mode — Players see question + answers', ar: 'الوضع الكامل — يرى اللاعبون السؤال والإجابات' },
    setting_randomize_questions: { en: 'Randomize Questions', ar: 'ترتيب عشوائي للأسئلة' },
    setting_sfx: { en: 'Sound Effects', ar: 'المؤثرات الصوتية' },
    lobby_pin_label: { en: 'Game PIN:', ar: 'رمز اللعبة:' },
    persistent_pin: { en: 'PIN:', ar: 'الرمز:' },
    lobby_waiting_players: { en: 'Waiting for players...', ar: 'في انتظار اللاعبين...' },
    btn_start_now: { en: 'Start Now', ar: 'ابدأ الآن' },
    q_time_up: { en: 'Time\'s Up!', ar: 'انتهى الوقت!' },
    btn_next: { en: 'Next Question', ar: 'السؤال التالي' },
    btn_show_final: { en: 'Show Final Results', ar: 'عرض النتائج النهائية' },
    podium_title: { en: 'Final Results!', ar: 'النتائج النهائية!' },
    btn_play_again: { en: 'Play Again', ar: 'العب مرة أخرى' },
    btn_back_home: { en: 'Back to Home', ar: 'العودة للرئيسية' },
    btn_end_game: { en: 'End Game', ar: 'إنهاء اللعبة' },
    confirm_end_game: { en: 'Are you sure you want to end the game early?', ar: 'هل أنت متأكد أنك تريد إنهاء اللعبة مبكراً؟' },
    no_quizzes: { en: 'No quizzes available — create one first', ar: 'لا توجد اختبارات متاحة — قم بإنشاء واحد أولاً' },
    select_quiz_placeholder: { en: '-- Select a quiz --', ar: '-- اختر اختباراً --' },
    questions_count: { en: 'questions', ar: 'أسئلة' },
    player_joined: { en: 'joined', ar: 'انضموا' },
    player_joined_single: { en: 'player joined', ar: 'لاعب انضم' },
    error_create_game: { en: 'Failed to create game', ar: 'فشل إنشاء اللعبة' },
    error_start_game: { en: 'Failed to start', ar: 'فشل بدء اللعبة' },
    error_end_game: { en: 'Failed to end game', ar: 'فشل إنهاء اللعبة' },
    error_no_report: { en: 'No report data available.', ar: 'لا تتوفر بيانات للتقرير.' },

    host_type_answer_prompt: { en: 'Players are typing their answers...', ar: 'اللاعبون يكتبون إجاباتهم...' },
    host_correct_answer: { en: 'Correct Answer:', ar: 'الإجابة الصحيحة:' },
    host_correct_order: { en: 'Correct Order:', ar: 'الترتيب الصحيح:' },
    lbl_correct: { en: 'Correct', ar: 'صحيح' },
    lbl_wrong: { en: 'Wrong', ar: 'خاطئ' },
    lbl_correct_order: { en: 'Correct Order', ar: 'الترتيب الصحيح' },
    lbl_wrong_order: { en: 'Wrong Order', ar: 'الترتيب الخاطئ' },

    // --- Editor Page ---
    editor_title: { en: 'Quiz Manager', ar: 'مدير الاختبارات' },
    btn_import: { en: 'Import', ar: 'استيراد' },
    btn_export: { en: '📤 Export Quiz', ar: '📤 تصدير الاختبار' },
    btn_new_quiz: { en: '+ New Quiz', ar: '+ اختبار جديد' },
    btn_back_home: { en: '← Back to Home', ar: '← العودة للرئيسية' },
    btn_back_quizzes: { en: '← Back to Quizzes', ar: '← العودة للاختبارات' },
    quiz_title_ph: { en: 'Quiz Title', ar: 'عنوان الاختبار' },
    quiz_desc_ph: { en: 'Optional description...', ar: 'وصف اختياري...' },
    btn_save_quiz: { en: '💾 Save Quiz', ar: '💾 حفظ الاختبار' },
    title_questions: { en: 'Questions', ar: 'الأسئلة' },
    btn_add_question: { en: '+ Add', ar: '+ إضافة' },
    btn_add_image: { en: '📷 Add Image', ar: '📷 إضافة صورة' },
    q_type_mc: { en: 'Multiple Choice', ar: 'خيارات متعددة' },
    q_type_tf: { en: 'True/False', ar: 'صح/خطأ' },
    q_type_type: { en: 'Type Answer', ar: 'اكتب الإجابة' },
    q_type_puzzle: { en: 'Puzzle', ar: 'لغز/ترتيب' },
    ph_question_text: { en: 'Question text...', ar: 'نص السؤال...' },
    ph_answer: { en: 'Answer', ar: 'الإجابة' },
    ph_accepted: { en: 'Accepted answers (dash-separated)', ar: 'الإجابات المقبولة (افصل بينها بشرطة -)' },
    lbl_accepted_help: { en: 'Enter multiple accepted answers separated by dashes (-). Matching is case-insensitive.', ar: 'أدخل الإجابات المقبولة مفصولة بشرطة (-). التطابق لا يتأثر بحالة الأحرف.' },
    ph_puzzle_item: { en: 'Item (in correct order)', ar: 'العنصر (بالترتيب الصحيح)' },
    lbl_puzzle_help: { en: 'Enter items in the CORRECT order. They will be shuffled for players.', ar: 'أدخل العناصر بالترتيب الصحيح. سيتم خلطها للاعبين.' },
    lbl_true: { en: 'True', ar: 'صواب' },
    lbl_false: { en: 'False', ar: 'خطأ' },
    import_title: { en: 'Import Quiz', ar: 'استيراد اختبار' },
    import_drop: { en: 'Drag & Drop a file here', ar: 'اسحب وأفلت الملف هنا' },
    import_browse: { en: 'or click to browse', ar: 'أو انقر لتصفح الملفات' },
    import_formats: { en: 'Supports .xlsx, .json, .txt', ar: 'يدعم .xlsx, .json, .txt' },
    toast_saved: { en: 'Quiz and all questions saved!', ar: 'تم حفظ الاختبار والأسئلة!' },
    toast_q_text_req: { en: 'Question text is required', ar: 'نص السؤال مطلوب' },
    toast_select_correct: { en: 'Select the correct answer', ar: 'اختر الإجابة الصحيحة' },
    toast_exported: { en: 'Quiz exported successfully!', ar: 'تم تصدير الاختبار بنجاح!' },
    toast_export_failed: { en: 'Failed to export quiz', ar: 'فشل تصدير الاختبار' },
    btn_download_report: { en: '📄 Download Report', ar: '📄 تحميل التقرير' },
    btn_show_qr: { en: '📱 Show QR', ar: '📱 عرض الرمز' },
    qr_modal_title: { en: 'Scan to Join', ar: 'امسح الرمز للانضمام' },
    qr_modal_close: { en: 'Close', ar: 'إغلاق' },
    lbl_host_online: { en: 'Host Online (Worldwide)', ar: 'استضافة عبر الإنترنت (للعالم أجمع)' },
    msg_premium_online: { en: 'Online hosting is a Premium feature. Please upgrade to the full version.', ar: 'الاستضافة عبر الإنترنت ميزة مميزة. يرجى الترقية إلى النسخة الكاملة.' },
    msg_tunnel_error: { en: 'Failed to establish an online connection.', ar: 'فشل في إنشاء اتصال عبر الإنترنت.' },
    lbl_tunnel_starting: { en: 'Starting...', ar: 'جاري البدء...' },
    language_label: { en: 'Language', ar: 'اللغة' },
    new_quiz_title: { en: 'New Quiz', ar: 'اختبار جديد' },
    new_question_text: { en: 'New Question', ar: 'سؤال جديد' },
    btn_add_piece: { en: '+ Add Piece', ar: '+ إضافة قطعة' },
    lbl_arabic: { en: 'Arabic', ar: 'العربية' },
    lbl_english: { en: 'English', ar: 'الإنجليزية' },
    hotspot_on: { en: 'Local Hotspot: ON', ar: 'نقطة الاتصال المحلية: قيد التشغيل' },
    hotspot_off: { en: 'Local Hotspot: OFF', ar: 'نقطة الاتصال المحلية: متوقفة' },
    hotspot_restricted: { en: 'Restricted: Run as Administrator to use Hotspot', ar: 'مقيد: يجب تشغيل البرنامج كمسؤول لاستخدام نقطة الاتصال' },
    hotspot_unsupported: { en: 'Hotspot Unsupported (Check Hardware)', ar: 'نقطة الاتصال غير مدعومة (تحقق من الجهاز)' }
};

// State
let currentLang = localStorage.getItem('kahoot_lang') || 'ar'; // Default Arabic

// Function to set language and apply direction
function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'ar';
    currentLang = lang;
    localStorage.setItem('kahoot_lang', lang);

    // Set document properties
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Toggle logo dynamically if it exists on the page
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.src = lang === 'en' ? '/img/English%20logo.png' : '/img/arabic%20logo.png';
    }

    // Apply translations to data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key] && translations[key][lang]) {
            // For inputs/textareas, update placeholder if they have one, otherwise value or textContent
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.getAttribute('placeholder') !== null) {
                el.placeholder = translations[key][lang];
            } else {
                el.textContent = translations[key][lang];
            }
        }
    });

    // Fire custom event for scripts that need to re-render innerHTML manually
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Function to immediately get translated string by key
function t(key, fallback = '') {
    if (translations[key] && translations[key][currentLang]) {
        return translations[key][currentLang];
    }
    // Fallback to English, then to provided fallback
    if (translations[key] && translations[key]['en']) {
        return translations[key]['en'];
    }
    return fallback || key;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    // Inject language toggle button if there isn't one already configured somewhere
    // But usually we just call setLanguage() immediately
    setLanguage(currentLang);

    // --- Inject Universal Fullscreen Toggle Button ---
    const fsBtn = document.createElement('button');
    fsBtn.className = 'fullscreen-toggle-btn';
    fsBtn.title = t('toggle_fullscreen', 'Toggle Fullscreen');

    // SVG Icons
    const svgEnter = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
    const svgExit = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`;

    fsBtn.innerHTML = svgEnter;

    fsBtn.addEventListener('click', async () => {
        if (window.electronAPI) {
            const isCurrentlyFS = await window.electronAPI.getFullscreenState();
            window.electronAPI.toggleFullscreen(!isCurrentlyFS);
            localStorage.setItem('kahoot_fullscreen', (!isCurrentlyFS).toString());
        } else {
            // Fallback for browser testing
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    localStorage.setItem('kahoot_fullscreen', 'true');
                }).catch(err => {
                    console.warn('Error attempting to enable fullscreen:', err.message);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(() => {
                        localStorage.setItem('kahoot_fullscreen', 'false');
                    });
                }
            }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        fsBtn.innerHTML = document.fullscreenElement ? svgExit : svgEnter;
    });

    // In Electron, we check state via bridge as well
    if (window.electronAPI) {
        setInterval(async () => {
            const isFS = await window.electronAPI.getFullscreenState();
            fsBtn.innerHTML = isFS ? svgExit : svgEnter;
        }, 500);
    }

    document.body.appendChild(fsBtn);

    // --- Persistence: Re-enter Fullscreen on Page Navigation ---
    let wasFullscreen = localStorage.getItem('kahoot_fullscreen');
    
    // Default to true for players on their first visit
    if (wasFullscreen === null && window.location.pathname.includes('play.html')) {
        wasFullscreen = 'true';
        localStorage.setItem('kahoot_fullscreen', 'true');
    }

    if (wasFullscreen === 'true') {
        if (window.electronAPI) {
            window.electronAPI.toggleFullscreen(true);
        } else if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
                localStorage.setItem('kahoot_fullscreen', 'false');
            });
        }
    }
});
