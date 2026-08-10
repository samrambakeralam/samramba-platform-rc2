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
        carousel.querySelector(".rc2-carousel-track");

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

                <div class="rc2-carousel-image-wrap">

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