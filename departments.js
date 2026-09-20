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
// تحميل الأقسام
// =====================================================

async function loadDepartments() {

    const container =
        document.getElementById(
            "departmentsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabase

            .from("sections")

            .select(
                "id,name,description,icon,image"
            )

            .eq(
                "active",
                true
            )

            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        renderDepartments(
            data || []
        );


    } catch (error) {

        console.error(
            "Departments Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="
                    alert
                    alert-danger
                    text-center
                ">

                    تعذر تحميل الأقسام
                    حاليًا.

                </div>

            </div>

        `;

    }

}


// =====================================================
// عرض الأقسام
// =====================================================

function renderDepartments(
    departments
) {

    const container =
        document.getElementById(
            "departmentsContainer"
        );


    if (!container) {
        return;
    }


    if (!departments.length) {

        container.innerHTML = `

            <div class="
                col-12
                text-center
                py-5
            ">

                <i class="
                    fas fa-hospital
                    fa-3x
                    mb-3
                "></i>

                <h4>
                    لا توجد أقسام متاحة حاليًا
                </h4>

            </div>

        `;

        return;
    }


    container.innerHTML =
        departments
            .map(
                createDepartmentCard
            )
            .join("");

}


// =====================================================
// إنشاء بطاقة القسم
// =====================================================

function createDepartmentCard(
    department
) {

    const icon =
        department.icon ||
        "fas fa-hospital";


    const name =
        escapeHTML(
            department.name
        );


    const description =
        escapeHTML(
            department.description ||
            "نقدم لكم أفضل الخدمات الطبية المتخصصة."
        );


    return `

        <div
            class="
                col-lg-4
                col-md-6
                mb-4
            "
        >

            <div
                class="
                    department-card
                    h-100
                "
            >


                <!-- الصورة -->

                <div class="
                    department-image
                ">

                    ${
                        department.image

                        ?

                        `
                        <img
                            src="${escapeHTML(
                                department.image
                            )}"
                            alt="${name}"
                            loading="lazy"
                            onerror="
                                this.style.display='none';
                                this.parentElement
                                    .classList
                                    .add('no-image');
                            "
                        >
                        `

                        :

                        `
                        <div class="
                            department-icon
                        ">

                            <i class="
                                ${escapeHTML(
                                    icon
                                )}
                            "></i>

                        </div>
                        `
                    }

                </div>


                <!-- المحتوى -->

                <div class="
                    department-content
                ">


                    <h3>
                        ${name}
                    </h3>


                    <p>
                        ${description}
                    </p>


                    <a
                        href="booking.html"
                        class="
                            department-book-btn
                        "
                    >

                        <i class="
                            fas
                            fa-calendar-check
                        "></i>

                        احجز موعدك

                    </a>


                </div>

            </div>

        </div>

    `;

}


// =====================================================
// حماية النصوص
// =====================================================

function escapeHTML(
    value
) {

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


// =====================================================
// تشغيل
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    loadDepartments
);