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
    },


    {
        id: "millionnaire",
        type: "book",

        title:
            "Secrets of the Millionaire Mind",

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
    }

];


/* =========================================================
   FEATURED LEARNING MODULE DATA
========================================================= */

const FEATURED_MODULE_DATA = [

    {
        id: "startup-fundamentals",

        number: "MODULE 01",

        category: "Entrepreneurship",

        title: "Startup Fundamentals",

        description:
            "Build a strong foundation in entrepreneurship by learning idea validation, product development, branding, sales, finance, and business growth.",

        pages: "7 Pages",

        readTime: "15–20 min read",

        badge: "FREE PREVIEW",

        buttonText: "Read Preview",

        link: "#",

        active: true
    },


    {
        id: "viral-marketing",

        number: "MODULE 02",

        category: "Marketing Strategy",

        title: "Viral Marketing",

        description:
            "Learn why ideas, products, and messages spread naturally, and discover practical principles for creating memorable and shareable marketing.",

        pages: "9 Pages",

        readTime: "20–25 min read",

        badge: "PREVIEW EDITION",

        buttonText: "Read Preview",

        link: "#",

        active: true
    },


    {
        id: "psychology-selling",

        number: "MODULE 03",

        category: "Sales Mastery",

        title: "Psychology of Selling",

        description:
            "Understand customer behaviour, communication, negotiation, and relationship building to become more confident in real-world selling situations.",

        pages: "7 Pages",

        readTime: "15–20 min read",

        badge: "PREVIEW EDITION",

        buttonText: "Read Preview",

        link: "#",

        active: true
    }

];

/* =========================================================
   CAROUSEL INITIALISATION
   INFINITE / CIRCULAR CAROUSEL
   DESKTOP + MOBILE
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


    if (!items.length) {
        return;
    }


    /* =====================================================
       RENDER ORIGINAL CARDS
    ===================================================== */

    renderCarousel(
        track,
        items
    );


    const originalCards =
        Array.from(
            track.querySelectorAll(
                ".rc2-carousel-card"
            )
        );


    if (!originalCards.length) {
        return;
    }


    const total =
        originalCards.length;


    /* =====================================================
       CREATE THREE IDENTICAL SETS

       [ CLONE SET ]
       [ ORIGINAL SET ]
       [ CLONE SET ]
    ===================================================== */

    const leftFragment =
        document.createDocumentFragment();


    const rightFragment =
        document.createDocumentFragment();


    originalCards.forEach(card => {

        leftFragment.appendChild(
            card.cloneNode(true)
        );

    });


    originalCards.forEach(card => {

        rightFragment.appendChild(
            card.cloneNode(true)
        );

    });


    track.insertBefore(
        leftFragment,
        track.firstChild
    );


    track.appendChild(
        rightFragment
    );


    /* =====================================================
       GET CARD STEP
    ===================================================== */

    function getCardStep() {

        const card =
            track.querySelector(
                ".rc2-carousel-card"
            );


        if (!card) {
            return 0;
        }


        const gap =
            parseFloat(
                getComputedStyle(track).gap
            ) || 0;


        return (
            card.offsetWidth +
            gap
        );

    }


    /* =====================================================
       GET COMPLETE SET WIDTH
    ===================================================== */

    function getSetWidth() {

        return (
            getCardStep() *
            total
        );

    }


    /* =====================================================
       START IN THE MIDDLE SET
    ===================================================== */

    function positionAtMiddleSet() {

        const setWidth =
            getSetWidth();


        if (!setWidth) {
            return;
        }


        track.scrollLeft =
            setWidth;

    }


    requestAnimationFrame(() => {

        positionAtMiddleSet();

    });


    /* =====================================================
       INVISIBLE RECYCLING

       IMPORTANT:

       We do NOT wait until the clone
       section ends.

       We recycle while there is still
       plenty of identical content on
       both sides.

       Because every set is identical,
       subtracting/adding one complete
       set produces the exact same view.
    ===================================================== */

    let recycling =
        false;


    function recycleIfNecessary() {

        if (recycling) {
            return;
        }


        const setWidth =
            getSetWidth();


        if (!setWidth) {
            return;
        }


        const current =
            track.scrollLeft;


        /*
           Move RIGHT

           Once we are beyond the middle
           of the middle/right boundary,
           shift one complete set LEFT.

           The visible cards are identical,
           so the user sees no jump.
        */

        if (
            current >=
            setWidth * 1.5
        ) {

            recycling =
                true;


            track.scrollLeft =
                current - setWidth;


            requestAnimationFrame(() => {

                recycling =
                    false;

            });


            return;

        }


        /*
           Move LEFT

           Once we are below the middle
           of the left/original boundary,
           shift one complete set RIGHT.
        */

        if (
            current <=
            setWidth * 0.5
        ) {

            recycling =
                true;


            track.scrollLeft =
                current + setWidth;


            requestAnimationFrame(() => {

                recycling =
                    false;

            });

        }

    }


    track.addEventListener(
        "scroll",
        recycleIfNecessary,
        {
            passive: true
        }
    );


    /* =====================================================
       DESKTOP ARROWS
    ===================================================== */

    const previousButton =
        document.getElementById(
            "rc2CarouselPrev"
        );


    const nextButton =
        document.getElementById(
            "rc2CarouselNext"
        );


    function getScrollAmount() {

        return getCardStep();

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                const amount =
                    getScrollAmount();


                if (!amount) {
                    return;
                }


                track.scrollBy({

                    left:
                        -amount,

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

                const amount =
                    getScrollAmount();


                if (!amount) {
                    return;
                }


                track.scrollBy({

                    left:
                        amount,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    /* =====================================================
       MOBILE SWIPE

       Native horizontal scrolling is used.

       Swipe LEFT  → NEXT
       Swipe RIGHT → PREVIOUS

       The same infinite track handles
       both directions.
    ===================================================== */

    let startX =
        0;

    let startY =
        0;


    carousel.addEventListener(
        "touchstart",
        event => {

            if (
                !event.touches.length
            ) {
                return;
            }


            startX =
                event.touches[0].clientX;


            startY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        event => {

            if (
                !event.changedTouches.length
            ) {
                return;
            }


            const endX =
                event.changedTouches[0].clientX;


            const endY =
                event.changedTouches[0].clientY;


            const distanceX =
                endX - startX;


            const distanceY =
                endY - startY;


            /*
               Ignore vertical gestures.
            */

            if (
                Math.abs(distanceY) >
                Math.abs(distanceX)
            ) {

                return;

            }


            /*
               Ignore tiny movements.
            */

            if (
                Math.abs(distanceX) < 40
            ) {

                return;

            }


            const amount =
                getScrollAmount();


            if (!amount) {
                return;
            }


            /*
               SWIPE LEFT
               → NEXT CARD
            */

            if (
                distanceX < 0
            ) {

                track.scrollBy({

                    left:
                        amount,

                    behavior:
                        "smooth"

                });

            }


            /*
               SWIPE RIGHT
               → PREVIOUS CARD
            */

            else {

                track.scrollBy({

                    left:
                        -amount,

                    behavior:
                        "smooth"

                });

            }

        },
        {
            passive: true
        }
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
   FEATURED MODULES — DYNAMIC RENDERER
========================================================= */

function renderFeaturedModules() {

    const track =
        document.getElementById(
            "featuredModulesTrack"
        );

    if (!track) {

        console.warn(
            "Featured Modules track not found."
        );

        return;

    }

    const items =
        FEATURED_MODULE_DATA.filter(
            item => item.active
        );

    track.innerHTML = "";

    items.forEach(
        (item, index) => {

            const card =
                document.createElement("article");

            card.className =
                "module-card";

            card.dataset.index =
                index;

            card.innerHTML = `

                <div class="module-cover">

                    <div class="module-cover-content">

                        <div class="module-cover-text">

                            <span class="module-number">
                                ${item.number}
                            </span>

                            <h4>
                                ${item.category}
                            </h4>

                        </div>

                        <span class="preview-badge">
                            ${item.badge}
                        </span>

                    </div>

                </div>


                <h3>
                    ${item.title}
                </h3>


                <p>
                    ${item.description}
                </p>


                <div class="module-footer">

                    <div class="module-meta">

                        <span>
                            📄 ${item.pages}
                        </span>

                        <span>
                            ⏱ ${item.readTime}
                        </span>

                    </div>


                    <a
                        href="${item.link}"
                        class="module-button"
                    >
                        📖 ${item.buttonText}
                    </a>

                </div>

            `;

            track.appendChild(card);

        }
    );

}

/* =========================================================
   VISION • MISSION • PROMISE — MOBILE COVER FLOW
========================================================= */

function initialiseMissionValuesCarousel() {

    const carousel =
        document.querySelector(".mission-values");

        /* Prevent native horizontal scrolling */

        carousel.scrollLeft = 0;

    if (!carousel) {

        console.warn(
            "Mission Values carousel not found."
        );

        return;

    }

    const cards =
        Array.from(
            carousel.querySelectorAll(".value-card")
        );

    if (cards.length !== 3) {

        console.warn(
            "Mission Values carousel requires exactly 3 cards."
        );

        return;

    }


    /* -----------------------------------------------------
       MOBILE CHECK
    ----------------------------------------------------- */

    const isMobile =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;

    if (!isMobile) {

        return;

    }


    /* -----------------------------------------------------
       CARD POSITIONS
       
       left   = Promise
       center = Vision
       right  = Mission
    ----------------------------------------------------- */

    let positions = [
        "center",
        "right",
        "left"
    ];


    /* -----------------------------------------------------
       APPLY POSITIONS
    ----------------------------------------------------- */

    function updateCards() {

    carousel.scrollLeft = 0;

    cards.forEach(
        (card, index) => {

            const position =
                positions[index];

            card.classList.remove(
                "mvc-left",
                "mvc-center",
                "mvc-right"
            );

            card.classList.add(
                "mvc-" + position
            );


            /* ------------------------------------------
               APPLY POSITION DIRECTLY
            ------------------------------------------ */

            if (position === "left") {

                // LEFT
                card.style.transform =
                "translateX(-78%) scale(.92) rotateY(8deg)";

                card.style.opacity =
                    ".65";

                card.style.zIndex =
                    "1";

            }


            else if (position === "center") {

                card.style.transform =
                "translateX(-50%) scale(1.05) rotateY(0deg)";

                card.style.opacity =
                    "1";

                card.style.zIndex =
                    "3";

                card.style.boxShadow =
                    "0 20px 50px rgba(15,23,42,.14)";

            }


            else if (position === "right") {

                // RIGHT
                card.style.transform =
                "translateX(-22%) scale(.92) rotateY(-8deg)";

                card.style.opacity =
                    ".65";

                card.style.zIndex =
                    "1";

            }

        }
    );

}


    /* -----------------------------------------------------
   ROTATE LEFT
----------------------------------------------------- */

function rotateLeft() {

    positions = [
        positions[2],
        positions[0],
        positions[1]
    ];

    updateCards();

}


/* -----------------------------------------------------
   ROTATE RIGHT
----------------------------------------------------- */

function rotateRight() {

    positions = [
        positions[1],
        positions[2],
        positions[0]
    ];

    updateCards();

}


    /* -----------------------------------------------------
       TOUCH / SWIPE
    ----------------------------------------------------- */

    let startX = 0;
    let endX = 0;


    carousel.addEventListener(
        "touchstart",
        event => {

            startX =
                event.touches[0].clientX;

        },
        { passive:true }
    );


    carousel.addEventListener(
        "touchend",
        event => {

            endX =
                event.changedTouches[0].clientX;

            const distance =
                endX - startX;


            if (Math.abs(distance) < 35) {

                return;

            }


            if (distance < 0) {

                rotateLeft();

            } else {

                rotateRight();

            }

        },
        { passive:true }
    );


    /* -----------------------------------------------------
       INITIAL STATE
    ----------------------------------------------------- */

    updateCards();

}


/* =========================================================
   FEATURED MODULES — CAROUSEL CONTROLS
========================================================= */

function initialiseFeaturedModulesCarousel() {

    const track =
        document.getElementById(
            "featuredModulesTrack"
        );

    const previousButton =
        document.getElementById(
            "featuredModulesPrev"
        );

    const nextButton =
        document.getElementById(
            "featuredModulesNext"
        );


    if (
        !track ||
        !previousButton ||
        !nextButton
    ) {

        console.warn(
            "Featured Modules carousel controls not found."
        );

        return;

    }


    const getScrollAmount = () => {

        const card =
            track.querySelector(
                ".module-card"
            );

        if (!card) {
            return 0;
        }


        const gap =
            parseFloat(
                getComputedStyle(track).gap
            ) || 0;


        return card.offsetWidth + gap;

    };


    previousButton.addEventListener(
        "click",
        () => {

            track.scrollBy({

                left:
                    -getScrollAmount(),

                behavior:
                    "smooth"

            });

        }
    );


    nextButton.addEventListener(
        "click",
        () => {

            track.scrollBy({

                left:
                    getScrollAmount(),

                behavior:
                    "smooth"

            });

        }
    );

}


/* =========================================================
   START CAROUSEL
========================================================= */

/* =========================================================
   START CAROUSELS
========================================================= */

function startAllCarousels() {

    initialiseCarousel();

    renderFeaturedModules();

    initialiseFeaturedModulesCarousel();

    initialiseMissionValuesCarousel();

}


/* ---------------------------------------------------------
   START WHEN DOM IS READY
--------------------------------------------------------- */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startAllCarousels
    );

} else {

    startAllCarousels();

}