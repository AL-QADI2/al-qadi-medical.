/*==========================
Back To Top
===========================*/

document.addEventListener("DOMContentLoaded", () => {

    const topBtn = document.getElementById("topBtn");

    if (!topBtn) return;

    // إظهار وإخفاء الزر
    window.addEventListener("scroll", () => {

       if (window.scrollY > 300) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }

    });

    // الرجوع إلى أعلى الصفحة
    topBtn.addEventListener("click", (e) => {

        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});

/*==========================
Navbar Scroll
===========================*/

const nav = document.querySelector(".navbar");

if (nav) {

    window.addEventListener("scroll", () => {

        nav.classList.toggle("scrolled", window.scrollY > 50);

    });

}


/*==========================
AOS
===========================*/
if (typeof AOS !== "undefined") {

    AOS.init({
        duration:800,
        once:true,
        offset:100
    });

}
 /* =========================
       AOS
    ========================= */

    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });


    /* =========================
       BACK TO TOP
    ========================= */

    const topBtn = document.getElementById("topBtn");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 300) {

            topBtn.classList.add("show");

        } else {

            topBtn.classList.remove("show");

        }

    });


    topBtn.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
