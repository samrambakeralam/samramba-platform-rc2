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

        title: "The Fastlane",
        subtitle:
            "A powerful perspective on entrepreneurship, wealth and building a better future.",

        image: "assets/fastlane.jpg",

        badge: "FEATURED",

        buttonText: "Explore",

        link: "#learning-modules",

        active: true
    },


    {
        id: "hack",
        type: "book",

        title: "The Millionaire Fastlane",
        subtitle:
            "Explore ideas around wealth creation, business and financial independence.",

        image: "assets/hack.jpg",

        badge: "FEATURED",

        buttonText: "Explore",

        link: "#learning-modules",

        active: true
    },


    {
        id: "millionnaire",
        type: "book",

        title: "Millionnaire",
        subtitle:
            "Discover ideas that can reshape the way you think about money, success and opportunity.",

        image: "assets/millionnaire.jpg",

        badge: "FEATURED",

        buttonText: "Explore",

        link: "#learning-modules",

        active: true
    },


    {
        id: "start",
        type: "book",

        title: "Start",
        subtitle:
            "Turn ideas into action and take the first step toward meaningful growth.",

        image: "assets/start.jpg",

        badge: "FEATURED",

        buttonText: "Explore",

        link: "#learning-modules",

        active: true
    },


    {
        id: "startup",
        type: "book",

        title: "Startup",
        subtitle:
            "Explore practical ideas for entrepreneurship, innovation and building businesses.",

        image: "assets/startup.jpg",

        badge: "FEATURED",

        buttonText: "Explore",

        link: "#learning-modules",

        active: true
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
                        ${item.subtitle}
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