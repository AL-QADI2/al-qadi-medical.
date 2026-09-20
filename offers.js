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
// تحميل العروض
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadOffers();

});


async function loadOffers() {

    const container =
        document.getElementById("offersContainer");


    if (!container) {
        return;
    }


    try {

        const {
            data: offers,
            error
        } = await supabase

            .from("offers")

            .select(`
                id,
                title,
                description,
                price,
                old_price,
                discount,
                image,
                icon,
                is_featured,
                active
            `)

            .eq("active", true)

            .order("created_at", {
                ascending: false
            });


        if (error) {
            throw error;
        }


        renderOffers(
            container,
            offers || []
        );


    } catch (error) {

        console.error(
            "Offers Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    <i class="fas fa-exclamation-circle"></i>

                    تعذر تحميل العروض حالياً.

                </div>

            </div>

        `;

    }

}


// =====================================================
// عرض البطاقات
// =====================================================

function renderOffers(
    container,
    offers
) {


    if (!offers.length) {

        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <div class="no-offers">

                    <i class="fas fa-gift"></i>

                    <h4>
                        لا توجد عروض حالياً
                    </h4>

                    <p>
                        تابعنا لمعرفة أحدث عروضنا
                    </p>

                </div>

            </div>

        `;

        return;
    }


    container.innerHTML =
        offers
            .map(createOfferCard)
            .join("");

}


// =====================================================
// بطاقة العرض
// =====================================================

function createOfferCard(offer) {


    const price =
        Number(offer.price || 0);


    const oldPrice =
        Number(offer.old_price || 0);


    let discount =
        Number(offer.discount || 0);


    // حساب الخصم تلقائياً
    if (
        !discount &&
        oldPrice > price &&
        oldPrice > 0
    ) {

        discount = Math.round(

            (
                (oldPrice - price)
                /
                oldPrice
            )
            * 100

        );

    }


    const icon =
        offer.icon ||
        "fas fa-gift";


    return `

        <div class="col-xl-4 col-md-6">

            <div class="
                offer-card
                ${offer.is_featured ? "featured" : ""}
            ">


                ${
                    offer.is_featured
                    ?
                    `
                    <div class="offer-featured">

                        <i class="fas fa-star"></i>

                        الأكثر طلباً

                    </div>
                    `
                    :
                    ""
                }


                ${
                    discount > 0
                    ?
                    `
                    <div class="offer-discount">

                        خصم ${discount}%

                    </div>
                    `
                    :
                    ""
                }


                <div class="offer-image">

                    ${
                        offer.image
                        ?
                        `
                        <img
                            src="${escapeHTML(offer.image)}"
                            alt="${escapeHTML(offer.title)}"
                            loading="lazy"
                        >
                        `
                        :
                        `
                        <div class="offer-icon">

                            <i class="${escapeHTML(icon)}"></i>

                        </div>
                        `
                    }

                </div>


                <div class="offer-content">


                    <h3>
                        ${escapeHTML(offer.title)}
                    </h3>


                    <p>
                        ${escapeHTML(
                            offer.description || ""
                        )}
                    </p>


                    <div class="offer-price">


                        ${
                            oldPrice > price
                            ?
                            `
                            <span class="old-price">

                                ${formatPrice(oldPrice)}

                            </span>
                            `
                            :
                            ""
                        }


                        <span class="new-price">

                            ${formatPrice(price)}

                        </span>


                    </div>


                    <a
                        href="appointment.html?offer=${encodeURIComponent(offer.id)}"
                        class="btn btn-primary offer-book-btn"
                    >

                        <i class="fas fa-calendar-check"></i>

                        احجز الآن

                    </a>


                </div>

            </div>

        </div>

    `;
}


// =====================================================
// تنسيق السعر
// =====================================================

function formatPrice(price) {

    return (
        Number(price)
            .toLocaleString("ar-SA")
        + " ريال"
    );

}


// =====================================================
// حماية النصوص
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}