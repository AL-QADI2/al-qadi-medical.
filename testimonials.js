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
// تشغيل الصفحة
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTestimonials();

        setupTestimonialForm();

        setupRatingSelector();

    }
);


// =====================================================
// تحميل الآراء
// =====================================================

async function loadTestimonials() {

    const container =
        document.getElementById(
            "testimonialsContainer"
        );


    if (!container) {

        console.warn(
            "testimonialsContainer غير موجود"
        );

        return;
    }


    try {

        const {
            data,
            error
        } = await supabase

            .from("testimonials")

            .select(
                "id, name, text, rating, active, created_at"
            )

            .eq(
                "active",
                true
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        renderTestimonials(
            container,
            data || []
        );


    } catch (error) {

        console.error(
            "Testimonials Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    تعذر تحميل آراء المرضى.

                </div>

            </div>

        `;

    }

}


// =====================================================
// عرض الآراء
// =====================================================

function renderTestimonials(
    container,
    testimonials
) {

    if (!testimonials.length) {

        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <i class="
                    fas fa-comments
                    fa-3x
                    mb-3
                "></i>

                <h4>
                    كن أول من يشاركنا رأيه
                </h4>

                <p>
                    نقدر تجربتك معنا.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        testimonials
            .map(
                createTestimonialCard
            )
            .join("");

}


// =====================================================
// بطاقة الرأي
// =====================================================

function createTestimonialCard(
    testimonial
) {

    const rating =
        Math.min(
            5,
            Math.max(
                1,
                Number(
                    testimonial.rating || 5
                )
            )
        );


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rating

                ? `<i class="fas fa-star"></i>`

                : `<i class="far fa-star"></i>`;

    }


    return `

        <div class="col-xl-6 col-md-6">

            <div class="testimonial-card">

                <div class="testimonial-header">

                    <div class="
                        testimonial-avatar
                        initials
                    ">

                        ${escapeHTML(
                            getInitials(
                                testimonial.name
                            )
                        )}

                    </div>


                    <div class="testimonial-info">

                        <h3>

                            ${escapeHTML(
                                testimonial.name
                            )}

                        </h3>

                    </div>

                </div>


                <div
                    class="testimonial-rating"
                    dir="ltr"
                >

                    ${stars}

                </div>


                <div class="testimonial-comment">

                    <i class="
                        fas fa-quote-right
                    "></i>

                    <p>

                        ${escapeHTML(
                            testimonial.text
                        )}

                    </p>

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// إعداد النموذج
// =====================================================

function setupTestimonialForm() {

    const form =
        document.getElementById(
            "testimonialForm"
        );


    if (!form) {

        console.warn(
            "testimonialForm غير موجود"
        );

        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await submitTestimonial(
                form
            );

        }
    );

}


// =====================================================
// اختيار التقييم بالنجوم
// =====================================================

function setupRatingSelector() {

    const selector =
        document.getElementById(
            "ratingSelector"
        );

    const ratingInput =
        document.getElementById(
            "testimonialRating"
        );


    if (!selector || !ratingInput) {
        return;
    }


    const stars =
        Array.from(
            selector.querySelectorAll(
                ".rating-star"
            )
        );


    function setRating(value) {

        const rating =
            Math.min(
                5,
                Math.max(
                    1,
                    Number(value)
                )
            );


        ratingInput.value = rating;


        stars.forEach(
            star => {

                const isSelected =
                    Number(star.dataset.rating)
                    <= rating;


                star.classList.toggle(
                    "active",
                    isSelected
                );


                star.setAttribute(
                    "aria-pressed",
                    String(isSelected)
                );

            }
        );
    }


    stars.forEach(
        star => {

            star.addEventListener(
                "click",
                () => setRating(
                    star.dataset.rating
                )
            );

        }
    );


    setRating(
        ratingInput.value || 5
    );
}


// =====================================================
// إرسال الرأي
// =====================================================

async function submitTestimonial(
    form
) {

    const nameInput =
        document.getElementById(
            "testimonialName"
        );


    const textInput =
        document.getElementById(
            "testimonialComment"
        );


    const ratingInput =
        document.getElementById(
            "testimonialRating"
        );


    const button =
        document.getElementById(
            "submitTestimonialBtn"
        );


    const message =
        document.getElementById(
            "testimonialMessage"
        );


    const name =
        nameInput?.value.trim();


    const text =
        textInput?.value.trim();


    const rating =
        Number(
            ratingInput?.value || 5
        );


    // -----------------------------------------------
    // التحقق
    // -----------------------------------------------

    if (!name) {

        showMessage(
            message,
            "يرجى كتابة الاسم.",
            "danger"
        );

        return;
    }


    if (!text) {

        showMessage(
            message,
            "يرجى كتابة رأيك.",
            "danger"
        );

        return;
    }


    if (
        rating < 1 ||
        rating > 5
    ) {

        showMessage(
            message,
            "التقييم يجب أن يكون من 1 إلى 5.",
            "danger"
        );

        return;
    }


    // -----------------------------------------------
    // تعطيل الزر
    // -----------------------------------------------

    if (button) {

        button.disabled = true;

        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            جاري الإرسال...
        `;

    }


    try {

        // -------------------------------------------
        // Supabase INSERT
        // -------------------------------------------

        const {
            data,
            error
        } = await supabase

            .from("testimonials")

            .insert([

                {
                    name: name,

                    text: text,

                    rating: rating,

                    active: true
                }

            ])

            .select()
            .single();


        if (error) {
            throw error;
        }


        console.log(
            "Testimonial inserted:",
            data
        );


        // -------------------------------------------
        // رسالة نجاح
        // -------------------------------------------

        showMessage(
            message,
            "شكرًا لك ❤️ تم نشر رأيك بنجاح.",
            "success"
        );


        // -------------------------------------------
        // إظهار الرأي مباشرة
        // -------------------------------------------

        addTestimonialToPage(
            data
        );


        // -------------------------------------------
        // تنظيف النموذج
        // -------------------------------------------

        form.reset();


        if (ratingInput) {

            ratingInput.value = "5";

        }


        resetStars();


    } catch (error) {

        console.error(
            "Insert Testimonial Error:",
            error
        );


        showMessage(
            message,
            "تعذر إرسال الرأي: " +
            error.message,
            "danger"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                إرسال رأيي
            `;

        }

    }

}


// =====================================================
// إضافة الرأي الجديد مباشرة
// =====================================================

function addTestimonialToPage(
    testimonial
) {

    const container =
        document.getElementById(
            "testimonialsContainer"
        );


    if (!container) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "col-xl-6 col-md-6";


    wrapper.innerHTML =
        createTestimonialCard(
            testimonial
        );


    container.prepend(
        wrapper
    );

}


// =====================================================
// رسالة
// =====================================================

function showMessage(
    element,
    text,
    type
) {

    if (!element) {

        alert(text);

        return;
    }


    element.className =
        `alert alert-${type}`;


    element.textContent =
        text;


    element.style.display =
        "block";

}


// =====================================================
// إعادة النجوم
// =====================================================

function resetStars() {

    document
        .querySelectorAll(
            ".rating-star"
        )
        .forEach(
            star => {

                star.classList.add(
                    "active"
                );

            }
        );

}


// =====================================================
// الأحرف الأولى
// =====================================================

function getInitials(name) {

    const parts =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!parts.length) {
        return "?";
    }


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2);

    }


    return (
        parts[0].charAt(0) +
        parts[
            parts.length - 1
        ].charAt(0)
    );

}


// =====================================================
// حماية HTML
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
