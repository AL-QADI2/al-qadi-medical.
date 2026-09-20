import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL =
    "https://rubfvhqaeuuzdprgvzyw.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_hHrj46cA3oeTuPlK7_JzJQ_sgK-YhRX";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================================================
// تحميل إعدادات الموقع
// =====================================================

async function loadSiteSettings() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("site_settings")
            .select("*")
            .order("id", {
                ascending: true
            })
            .limit(1)
            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            console.warn(
                "لا توجد إعدادات للموقع."
            );

            return;
        }


        applySiteSettings(data);


    } catch (error) {

        console.error(
            "Site Settings Error:",
            error
        );

    }

}


// =====================================================
// تطبيق الإعدادات
// =====================================================

function applySiteSettings(settings) {


    // -------------------------------------------------
    // اسم الموقع
    // -------------------------------------------------

    setText(
        "[data-site-name]",
        settings.site_name
    );


    // -------------------------------------------------
    // وصف الموقع
    // -------------------------------------------------

    setText(
        "[data-site-description]",
        settings.site_description
    );


    // -------------------------------------------------
    // الهاتف
    // -------------------------------------------------

    setText(
        "[data-site-phone]",
        settings.phone
    );


    // -------------------------------------------------
    // واتساب
    // -------------------------------------------------

    setText(
        "[data-site-whatsapp]",
        settings.whatsapp
    );


    // -------------------------------------------------
    // البريد
    // -------------------------------------------------

    setText(
        "[data-site-email]",
        settings.email
    );


    // -------------------------------------------------
    // العنوان
    // -------------------------------------------------

    setText(
        "[data-site-address]",
        settings.address
    );


    // -------------------------------------------------
    // أوقات العمل
    // -------------------------------------------------

    setText(
        "[data-working-hours]",
        settings.working_hours
    );


    // -------------------------------------------------
    // الشعار
    // -------------------------------------------------

    setImage(
        "[data-site-logo]",
        settings.logo_url
    );


    // -------------------------------------------------
    // روابط التواصل
    // -------------------------------------------------

    setLink(
        "[data-facebook]",
        settings.facebook
    );


    setLink(
        "[data-instagram]",
        settings.instagram
    );


    setLink(
        "[data-twitter]",
        settings.twitter
    );


    setLink(
        "[data-snapchat]",
        settings.snapchat
    );


    setLink(
        "[data-google-maps]",
        settings.google_maps_url
    );


    // -------------------------------------------------
    // واتساب كرابط
    // -------------------------------------------------

    setWhatsappLink(
        "[data-whatsapp-link]",
        settings.whatsapp
    );


    // -------------------------------------------------
    // الهاتف كرابط
    // -------------------------------------------------

    setPhoneLink(
        "[data-phone-link]",
        settings.phone
    );


    // -------------------------------------------------
    // التحكم في الأقسام
    // -------------------------------------------------

    toggleSection(
        "[data-section='booking']",
        settings.booking_enabled
    );


    toggleSection(
        "[data-section='offers']",
        settings.offers_enabled
    );


    toggleSection(
        "[data-section='doctors']",
        settings.doctors_enabled
    );


    toggleSection(
        "[data-section='testimonials']",
        settings.testimonials_enabled
    );


    toggleSection(
        "[data-section='jobs']",
        settings.jobs_enabled
    );

}


// =====================================================
// تغيير النص
// =====================================================

function setText(
    selector,
    value
) {

    if (
        value === null ||
        value === undefined
    ) {
        return;
    }


    document
        .querySelectorAll(selector)
        .forEach(element => {

            element.textContent = value;

        });

}


// =====================================================
// تغيير الصورة
// =====================================================

function setImage(
    selector,
    url
) {

    if (!url) {
        return;
    }


    document
        .querySelectorAll(selector)
        .forEach(element => {

            element.src = url;

        });

}


// =====================================================
// تغيير الرابط
// =====================================================

function setLink(
    selector,
    url
) {

    document
        .querySelectorAll(selector)
        .forEach(element => {

            if (!url) {

                element.style.display =
                    "none";

                return;
            }


            element.href = url;

            element.target = "_blank";

            element.rel =
                "noopener noreferrer";

        });

}


// =====================================================
// رابط واتساب
// =====================================================

function setWhatsappLink(
    selector,
    phone
) {

    if (!phone) {
        return;
    }


    const cleanPhone =
        String(phone)
            .replace(/\D/g, "");


    document
        .querySelectorAll(selector)
        .forEach(element => {

            element.href =
                `https://wa.me/${cleanPhone}`;

            element.target = "_blank";

            element.rel =
                "noopener noreferrer";

        });

}


// =====================================================
// رابط الهاتف
// =====================================================

function setPhoneLink(
    selector,
    phone
) {

    if (!phone) {
        return;
    }


    const cleanPhone =
        String(phone)
            .replace(/\s/g, "");


    document
        .querySelectorAll(selector)
        .forEach(element => {

            element.href =
                `tel:${cleanPhone}`;

        });

}


// =====================================================
// إظهار / إخفاء القسم
// =====================================================

function toggleSection(
    selector,
    enabled
) {

    document
        .querySelectorAll(selector)
        .forEach(element => {

            element.style.display =
                enabled === true
                    ? ""
                    : "none";

        });

}


// =====================================================
// تشغيل
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    loadSiteSettings
);