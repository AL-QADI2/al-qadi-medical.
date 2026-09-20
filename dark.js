document.addEventListener("DOMContentLoaded", () => {

    const darkButton = document.getElementById("darkModeToggle");

    if (!darkButton) {
        console.error("لم يتم العثور على زر الوضع الداكن");
        return;
    }

    // استرجاع الحالة المحفوظة
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        darkButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    darkButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");
            darkButton.innerHTML = '<i class="fa-solid fa-sun"></i>';

        } else {

            localStorage.setItem("theme", "light");
            darkButton.innerHTML = '<i class="fa-solid fa-moon"></i>';

        }

    });

});