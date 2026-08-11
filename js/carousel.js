/* =========================================================
   SAMRAMBA KERALAM 2030
   RC2.3 — DATA-DRIVEN CAROUSEL ENGINE
========================================================= */


/* =========================================================
   CAROUSEL DATA

   Images can later be replaced without changing
   the carousel engine.
========================================================= */

const CAROUSEL_DATA = [

    {
        id: "fastlane",
        type: "book",

        title: "The Millionaire Fastlane",

        category:
            "Entrepreneurship • Wealth",

        image:
            "assets/fastlane.jpg",

        themeColor:
            "#FF0000",

        badge:
            "FEATURED",

        buttonText:
            "Explore",

        link:
            "#learning-modules",

        active:
            true
    },


    {
        id: "hack",
        type: "book",

        title: "Hack The Buyer Brain",

        category:
            "Marketing • Psychology",

        image:
            "assets/hack.jpg",

        themeColor:
            "#F4B400",

        badge:
            "FEATURED",

        buttonText:
            "Explore",

        link:
            "#learning-modules",

        active:
            true
    },


    {
        id: "millionnaire",
        type: "book",

        title: "Secrets of the Millionaire Mind",

        category:
            "Money • Mindset",

        image:
            "assets/millionnaire.jpg",

        themeColor:
            "#F3D6DD",

        badge:
            "FEATURED",

        buttonText:
            "Explore",

        link:
            "#learning-modules",

        active:
            true
    },


    {
        id: "start",
        type: "book",

        title:
            "Start Something That Matters",

        category:
            "Purpose • Entrepreneurship",

        image:
            "assets/start.jpg",

        themeColor:
            "#B9DCEB",

        badge:
            "FEATURED",

        buttonText:
            "Explore",

        link:
            "#learning-modules",

        active:
            true
    },


    {
        id: "startup",
        type: "book",

        title:
            "The $100 Startup",

        category:
            "Startup • Business",

        image:
            "assets/startup.jpg",

        themeColor:
            "#E9C8C4",

        badge:
            "FEATURED",

        buttonText:
            "Explore",

        link:
            "#learning-modules",

        active:
            true
    }

];


/* =========================================================
   CAROUSEL INITIALISATION
========================================================= */

function initialiseCarousel() {

    const carousel =
        document.getElementById("rc2Carousel");

    if (!carousel) {

        console.warn(
            "RC2 Carousel container not found."
        );

        return;

    }


    const track =
        carousel.querySelector(
            ".rc2-carousel-track"
        );

    if (!track) {

        console.warn(
            "RC2 Carousel track not found."
        );

        return;

    }


    const items =
        CAROUSEL_DATA.filter(
            item => item.active
        );


    renderCarousel(
        track,
        items
    );


    /* =========================================
       DESKTOP CAROUSEL CONTROLS
    ========================================= */

    const previousButton =
        document.getElementById(
            "rc2CarouselPrev"
        );

    const nextButton =
        document.getElementById(
            "rc2CarouselNext"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                const card =
                    track.querySelector(
                        ".rc2-carousel-card"
                    );

                if (!card) {
                    return;
                }


                const gap =
                    parseFloat(
                        getComputedStyle(track).gap
                    ) || 0;


                const scrollAmount =
                    card.offsetWidth + gap;


                track.scrollBy({

                    left:
                        -scrollAmount,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                const card =
                    track.querySelector(
                        ".rc2-carousel-card"
                    );

                if (!card) {
                    return;
                }


                const gap =
                    parseFloat(
                        getComputedStyle(track).gap
                    ) || 0;


                const scrollAmount =
                    card.offsetWidth + gap;


                track.scrollBy({

                    left:
                        scrollAmount,

                    behavior:
                        "smooth"

                });

            }
        );

    }

}


/* =========================================================
   RENDER CAROUSEL
========================================================= */

function renderCarousel(
    track,
    items
) {

    track.innerHTML = "";


    items.forEach(
        (item, index) => {

            const card =
                document.createElement("article");

            card.className =
                "rc2-carousel-card";


            card.dataset.index =
                index;


            card.innerHTML = `

                <div
    class="rc2-carousel-image-wrap"
    style="--rc2-carousel-theme: ${item.themeColor}"
>

    <img
        src="${item.image}"
        alt="${item.title}"
        class="rc2-carousel-image"
        loading="lazy"
    >

    <span class="rc2-carousel-badge">
        ${item.badge}
    </span>

</div>


                <div class="rc2-carousel-content">

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        <p>
    ${item.category}
</p>
                    </p>

                    <a
                        href="${item.link}"
                        class="rc2-carousel-button"
                    >
                        ${item.buttonText}

                        <i data-lucide="arrow-right"></i>

                    </a>

                </div>

            `;


            track.appendChild(card);

        }
    );


    /*
       Render Lucide icons added dynamically
    */

    if (
        typeof lucide !== "undefined"
    ) {

        lucide.createIcons();

    }

}


/* =========================================================
   START CAROUSEL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initialiseCarousel();

    }
);