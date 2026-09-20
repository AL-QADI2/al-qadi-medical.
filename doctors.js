import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ==========================================
// Supabase
// ==========================================

const SUPABASE_URL =
    "https://rubfvhqaeuuzdprgvzyw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hHrj46cA3oeTuPlK7_JzJQ_sgK-YhRX";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// Doctors Container
// ==========================================

const doctorsContainer =
    document.getElementById("doctorsContainer");


// ==========================================
// Image Helper
// ==========================================

function getDoctorImage(image) {

    if (!image) {
        return "images/doctors/default-doctor.jpg";
    }

    // إذا كانت الصورة رابطًا كاملًا
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    // إذا كان المسار موجودًا بالفعل
    if (
        image.startsWith("images/") ||
        image.startsWith("./images/")
    ) {
        return image;
    }

    // إذا كان اسم الصورة فقط
    return `images/doctors/${image}`;
}


// ==========================================
// Social Links
// ==========================================

function getSocialLinks(doctor) {

    let social = "";


    if (doctor.facebook) {

        social += `
            <a
                href="${doctor.facebook}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook">

                <i class="fa-brands fa-facebook-f"></i>

            </a>
        `;
    }


    if (doctor.instagram) {

        social += `
            <a
                href="${doctor.instagram}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram">

                <i class="fa-brands fa-instagram"></i>

            </a>
        `;
    }


    if (doctor.twitter) {

        social += `
            <a
                href="${doctor.twitter}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter">

                <i class="fa-brands fa-x-twitter"></i>

            </a>
        `;
    }


    return social;
}


// ==========================================
// Doctor Card
// ==========================================

function createDoctorCard(doctor, index) {

    const image =
        getDoctorImage(doctor.image);


    const socialLinks =
        getSocialLinks(doctor);


    return `

        <div
            class="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="${200 + (index * 100)}">


            <div class="doctor-card">


                <!-- Doctor Image -->

                <div class="doctor-image">

                    <img
                        src="${image}"
                        alt="${doctor.name}"
                        loading="lazy"
                        onerror="this.src='images/doctors/default-doctor.jpg';">


                </div>


                <!-- Doctor Info -->

                <div class="doctor-info">

                    <h3>
                        ${doctor.name}
                    </h3>


                    <p>
                        ${doctor.specialty}
                    </p>


                    ${
                        socialLinks
                            ? `
                                <div class="doctor-social">

                                    ${socialLinks}

                                </div>
                            `
                            : ""
                    }


                </div>


            </div>


        </div>

    `;
}


// ==========================================
// Load Doctors
// ==========================================

async function loadDoctors() {

    if (!doctorsContainer) {

        console.error(
            "doctorsContainer غير موجود في الصفحة"
        );

        return;
    }


    try {

        const {
            data,
            error
        } = await supabase

            .from("doctors")

            .select(`
                id,
                name,
                specialty,
                image,
                facebook,
                instagram,
                twitter,
                active,
                created_at
            `)

            .eq("active", true)

            .order("id", {
                ascending: true
            });


        if (error) {

            console.error(
                "Supabase Doctors Error:",
                error
            );

            doctorsContainer.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-danger text-center">

                        ❌ حدث خطأ أثناء تحميل بيانات الأطباء.

                    </div>

                </div>

            `;

            return;
        }


        console.log(
            "Doctors loaded:",
            data
        );


        if (!data || data.length === 0) {

            doctorsContainer.innerHTML = `

                <div class="col-12 text-center py-5">

                    <i class="fa-solid fa-user-doctor fa-3x mb-3"></i>

                    <h4>
                        لا يوجد أطباء متاحون حاليًا
                    </h4>

                </div>

            `;

            return;
        }


        doctorsContainer.innerHTML =
            data
                .map((doctor, index) =>
                    createDoctorCard(
                        doctor,
                        index
                    )
                )
                .join("");


        // إعادة تشغيل AOS
        if (
            typeof AOS !== "undefined"
        ) {

            AOS.refresh();

        }


    } catch (error) {

        console.error(
            "Unexpected Doctors Error:",
            error
        );


        doctorsContainer.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    ❌ تعذر تحميل الأطباء.

                </div>

            </div>

        `;

    }

}


// ==========================================
// Start
// ==========================================

loadDoctors();