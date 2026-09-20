document.addEventListener("DOMContentLoaded", () => {

    const stats = document.querySelector(".stats");
    const counters = document.querySelectorAll(".counter");

    if (!stats || counters.length === 0) return;

    let started = false;

    const observer = new IntersectionObserver((entries) => {

        if (entries[0].isIntersecting && !started) {

            started = true;

            counters.forEach(counter => {

                const target = parseInt(counter.dataset.target);
                let count = 0;

                const step = Math.max(1, Math.ceil(target / 150));

                const update = () => {

                    count += step;

                    if (count < target) {

                        counter.textContent = count.toLocaleString();
                        requestAnimationFrame(update);

                    } else {

                        counter.textContent = target.toLocaleString();

                    }

                };

                update();

            });

        }

    }, { threshold: 0.5 });

    observer.observe(stats);

});