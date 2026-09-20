import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// =====================================================
// Supabase
// =====================================================

const SUPABASE_URL =
    "https://rubfvhqaeuuzdprgvzyw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hHrj46cA3oeTuPlK7_JzJQ_sgK-YhRX";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================================================
// عناصر النموذج
// =====================================================

const bookingForm =
    document.getElementById("bookingForm");

const bookingButton =
    document.getElementById("bookingButton");

const bookingMessage =
    document.getElementById("bookingMessage");

const departmentSelect =
    document.getElementById("department");

const doctorSelect =
    document.getElementById("doctor");

const dateInput =
    document.getElementById("appointment_date");


// =====================================================
// التحقق من وجود العناصر
// =====================================================

if (!bookingForm) {
    console.error("لم يتم العثور على bookingForm");
}

if (!departmentSelect) {
    console.error("لم يتم العثور على department");
}

if (!doctorSelect) {
    console.error("لم يتم العثور على doctor");
}


// =====================================================
// منع اختيار تاريخ سابق
// =====================================================

if (dateInput) {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;
}


// =====================================================
// الأطباء حسب العيادات
// =====================================================

const doctorsByDepartment = {

    internal: [
        {
            id: "ibrahim-bassiouni",
            name: "د. إبراهيم بسيوني",
            specialty: "استشاري الباطنة"
        }
    ],

    surgery: [
        {
            id: "adel-ibrahim",
            name: "د. عادل إبراهيم",
            specialty: "استشاري الجراحة"
        }
    ],

    ent: [
        {
            id: "ali-fouad",
            name: "د. علي فؤاد",
            specialty: "استشاري الأنف والأذن"
        }
    ],

    dentistry: [
        {
            id: "jehad-junaid",
            name: "د. جهاد جنيد",
            specialty: "طب الأسنان"
        },

        {
            id: "samar-sawani",
            name: "د. سمر صواني",
            specialty: "طب الأسنان"
        }
    ],

    ultrasound: [
        {
            id: "soha",
            name: "د. سهى",
            specialty: "السونار"
        }
    ],

    general: [
        {
            id: "ahmed-abdelsamee",
            name: "د. أحمد عبدالسميع",
            specialty: "طب عام"
        },

        {
            id: "rana-ahmed",
            name: "د. رنا أحمد",
            specialty: "طب عام"
        }
    ],

    pediatrics: [
        {
            id: "sawsan",
            name: "د. سوسن",
            specialty: "طب الأطفال"
        }
    ],

    gynecology: [
        {
            id: "sara-mekhlafi",
            name: "د. سارة مخلافي",
            specialty: "نساء وتوليد"
        }
    ]

};


// =====================================================
// تغيير العيادة Department
// =====================================================

if (departmentSelect) {

    departmentSelect.addEventListener(
        "change",
        function () {

            const department =
                this.value;

            // تنظيف قائمة الأطباء
            doctorSelect.innerHTML = "";

            // لم يتم اختيار عيادة
            if (!department) {

                doctorSelect.disabled = true;

                doctorSelect.innerHTML = `
                    <option value="">
                        اختر العيادة أولاً
                    </option>
                `;

                return;
            }


            // الحصول على أطباء العيادة
            const doctors =
                doctorsByDepartment[department] || [];


            // لا يوجد أطباء
            if (doctors.length === 0) {

                doctorSelect.disabled = true;

                doctorSelect.innerHTML = `
                    <option value="">
                        لا يوجد أطباء متاحون
                    </option>
                `;

                return;
            }


            // تفعيل قائمة الأطباء
            doctorSelect.disabled = false;


            // إضافة الخيار الأول
            doctorSelect.innerHTML = `
                <option value="">
                    اختر الطبيب
                </option>
            `;


            // إضافة الأطباء
            doctors.forEach(function (doctor) {

                const option =
                    document.createElement("option");

                option.value =
                    doctor.id;

                option.textContent =
                    `${doctor.name} - ${doctor.specialty}`;

                doctorSelect.appendChild(option);

            });


            // إذا كان طبيب واحد
            if (doctors.length === 1) {

                doctorSelect.value =
                    doctors[0].id;

            }

        }
    );

}


// =====================================================
// إرسال الحجز إلى Supabase
// =====================================================

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // قراءة بيانات المريض
            // =================================================

            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const identity =
                document
                    .getElementById("identity")
                    .value
                    .trim();


            const birthDate =
                document
                    .getElementById("birth_date")
                    .value
                    .trim();


            const emailElement =
                document.getElementById("email");

            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            // =================================================
            // العيادة
            // مهم: نستخدم department وليس clinic
            // =================================================

            const department =
                document
                    .getElementById("department")
                    .value;


            // =================================================
            // الطبيب
            // =================================================

            const doctor =
                document
                    .getElementById("doctor")
                    .value;


            // =================================================
            // تاريخ الموعد
            // =================================================

            const appointmentDate =
                document
                    .getElementById("appointment_date")
                    .value;


            // =================================================
            // وقت الموعد
            // =================================================

            const appointmentTime =
                document
                    .getElementById("appointment_time")
                    .value;


            // =================================================
            // الملاحظات
            // =================================================

            const notesElement =
                document.getElementById("notes");

            const notes =
                notesElement
                    ? notesElement.value.trim()
                    : "";


            // =================================================
            // التأكد من اختيار العيادة
            // =================================================

            if (!department) {

                alert("يرجى اختيار العيادة");

                return;
            }


            // =================================================
            // التأكد من اختيار الطبيب
            // =================================================

            if (!doctor) {

                alert("يرجى اختيار الطبيب");

                return;
            }


            // =================================================
            // Loading
            // =================================================

            if (bookingButton) {

                bookingButton.disabled = true;

                bookingButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin me-2"></i>
                    جاري إرسال الحجز...
                `;

            }


            if (bookingMessage) {

                bookingMessage.style.display =
                    "none";

            }


            // =================================================
            // إرسال البيانات إلى Supabase
            // =================================================

            const {
                data,
                error
            } = await supabase.rpc(
                "create_appointment",
                {

                    p_full_name:
                        fullName,

                    p_phone:
                        phone,

                    p_identity:
                        identity,

                    p_birth_date:
                        birthDate,

                    p_email:
                        email || null,

                    p_clinic:
                        department,

                    p_doctor:
                        doctor,

                    p_appointment_date:
                        appointmentDate,

                    p_appointment_time:
                        appointmentTime,

                    p_notes:
                        notes || null

                }
            );


            // =================================================
            // خطأ
            // =================================================

            if (error) {

                console.error(
                    "Supabase Error:",
                    error
                );


                if (bookingMessage) {

                    bookingMessage.style.display =
                        "block";

                    bookingMessage.style.background =
                        "#f8d7da";

                    bookingMessage.style.color =
                        "#842029";

                    bookingMessage.innerHTML = `
                        ❌ حدث خطأ أثناء إرسال الحجز.
                        <br>
                        <small>
                            ${error.message || "خطأ غير معروف"}
                        </small>
                    `;

                }


                if (bookingButton) {

                    bookingButton.disabled =
                        false;

                    bookingButton.innerHTML = `
                        <i class="fa-solid fa-calendar-check me-2"></i>
                        احجز الآن
                    `;

                }

                return;
            }


            // =================================================
            // نجاح
            // =================================================

            if (bookingMessage) {

                bookingMessage.style.display =
                    "block";

                bookingMessage.style.background =
                    "#d1e7dd";

                bookingMessage.style.color =
                    "#0f5132";

                bookingMessage.innerHTML = `
                    ✅ تم إرسال طلب الحجز بنجاح.
                    <br>
                    سيقوم فريق المجمع بالتواصل معك لتأكيد الموعد.
                `;

            }


            // تنظيف النموذج
            bookingForm.reset();


            // إعادة ضبط قائمة الطبيب
            if (doctorSelect) {

                doctorSelect.disabled =
                    true;

                doctorSelect.innerHTML = `
                    <option value="">
                        اختر العيادة أولاً
                    </option>
                `;

            }


            // إعادة التاريخ الأدنى
            if (dateInput) {

                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];

                dateInput.min = today;

            }


            // إعادة الزر
            if (bookingButton) {

                bookingButton.disabled =
                    false;

                bookingButton.innerHTML = `
                    <i class="fa-solid fa-calendar-check me-2"></i>
                    احجز الآن
                `;

            }

        }
    );

}


// =====================================================
// اختبار Supabase Session
// =====================================================

async function checkSupabaseSession() {

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    console.log(
        "Supabase session:",
        session
    );


    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();

    console.log(
        "Current Supabase user:",
        user
    );

}


checkSupabaseSession();