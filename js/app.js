// =======================================
// SAMRAMBA KERALAM 2030
// Frontend Controller (RC1)
// =======================================

const CONFIG = {

    API_URL:
        "https://samramba-api.samrambakerala.workers.dev",

    PRODUCT_PRICE: 499,

    CURRENCY: "INR"

};

// =======================================
// GLOBAL ELEMENTS
// =======================================

let modal;
let closeModal;
let continueButton;
let institutionCards;

let studentName;
let studentEmail;

let selectedInstitution = "";

// =======================================
// PAGE READY
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    // Icons
    lucide.createIcons();

    initialiseMobileMenu();

    initialiseRC2Navigation();
    initialiseDynamicHeader();
    initialiseUnboxingReveal();

    console.log("SAMRAMBA KERALAM 2030 Loaded");

    // Modal Elements

    modal = document.getElementById("registrationModal");

    closeModal = document.getElementById("closeModal");

    continueButton = document.getElementById("continuePayment");

    institutionCards =
        document.querySelectorAll(".institution-card");

    studentName =
        document.getElementById("studentName");

    studentEmail =
        document.getElementById("studentEmail");

    // Buttons

    initialiseButtons();

    initialiseModal();

    initialiseInstitutionCards();

    initialiseContinueButton();

});

// =======================================
// BUTTONS
// =======================================

function initialiseButtons() {

    const pricingButton =
        document.getElementById("pricingButton");

    const buyButton =
        document.getElementById("buyButton");

    const finalCTAButton =
        document.getElementById("finalCTAButton");

    if (pricingButton) {

        pricingButton.addEventListener("click", openModal);

    }

    if (buyButton) {

        buyButton.addEventListener("click", openModal);

    }

    if (finalCTAButton) {

        finalCTAButton.addEventListener("click", openModal);

    }

}

function openModal() {

    resetForm();

    modal.classList.add("active");

}

function closeRegistrationModal() {

    modal.classList.remove("active");

}

// =======================================
// MODAL
// =======================================

function initialiseModal() {

    closeModal.addEventListener("click", () => {

        closeRegistrationModal();

    });

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            closeRegistrationModal();

        }

    });

}

// =======================================
// INSTITUTIONS
// =======================================

function initialiseInstitutionCards() {

    institutionCards.forEach(card => {

        card.addEventListener("click", () => {

            institutionCards.forEach(c =>

                c.classList.remove("active")

            );

            card.classList.add("active");

            selectedInstitution =
                card.dataset.value;

        });

    });

}

// =======================================
// CONTINUE BUTTON
// =======================================

function initialiseContinueButton() {

    continueButton.addEventListener("click", () => {

        console.log("Continue button clicked");

        if (!validateForm()) {
            return;
        }

        console.log("Calling registerCustomer()");

        setLoading(true);

        registerCustomer();

    });

}

// =======================================
// VALIDATION
// =======================================

function validateForm() {

    const name =
        studentName.value.trim();

    const email =
        studentEmail.value.trim();

    if (name === "") {

        alert("Please enter your full name.");

        studentName.focus();

        return false;

    }

    if (email === "") {

        alert("Please enter your email.");

        studentEmail.focus();

        return false;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        alert("Please enter a valid email.");

        studentEmail.focus();

        return false;

    }

    if (selectedInstitution === "") {

        alert("Please select your institution.");

        return false;

    }

    return true;

}

// =======================================
// RESET
// =======================================

function resetForm() {

    studentName.value = "";

    studentEmail.value = "";

    selectedInstitution = "";

    institutionCards.forEach(card =>

        card.classList.remove("active")

    );

}

// =======================================
// LOADING
// =======================================

function setLoading(isLoading) {

    continueButton.disabled = isLoading;

    if (isLoading) {

        continueButton.innerHTML =
            "Creating Secure Checkout...";

    } else {

        continueButton.innerHTML =
            "Continue to Secure Payment";

    }

}

// =======================================
// REGISTRATION API
// =======================================

async function registerCustomer() {

    console.log("Inside registerCustomer()");

    try {

        const response = await fetch(
            CONFIG.API_URL + "/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: studentName.value.trim(),
                    email: studentEmail.value.trim(),
                    institution: selectedInstitution
                })
            }
        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            setLoading(false);

            alert(result.message);

            return;

        }

        //---------------------------------------
        // Razorpay Checkout
        //---------------------------------------

console.log("========== CREATE ORDER RESULT ==========");
console.log(result);
console.log("Customer ID from create-order:", result.customerID);

        const options = {

            key: result.razorpay.key,

            amount: result.razorpay.amount,

            currency: result.razorpay.currency,

            order_id: result.razorpay.orderID,

            name: "SAMRAMBA KERALAM 2030",

            description: "Complete Learning Library",

            prefill: {

                name: result.name,

                email: result.email

            },

            notes: {
        customerID: result.customerID
    },

    retry: {
        enabled: true
    },

            theme: {

                color: "#0F766E"

            },

            handler: async function (payment) {

    console.log("==================================");
    console.log("PAYMENT HANDLER STARTED");
    console.log("==================================");

    console.log("Payment Successful");

    console.log(payment);

    console.log("Calling /verify-payment...");

    try {

        const verifyResponse = await fetch(

            CONFIG.API_URL + "/verify-payment",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    customerID: result.customerID,

                    razorpay_payment_id:
                        payment.razorpay_payment_id,

                    razorpay_order_id:
                        payment.razorpay_order_id,

                    razorpay_signature:
                        payment.razorpay_signature

                })

            }

        );

        console.log("HTTP Status:", verifyResponse.status);

        const verifyResult = await verifyResponse.json();

        console.log("Verify Response:");

        console.log(verifyResult);

        setLoading(false);

        if (!verifyResult.success) {

            alert(verifyResult.message);

            return;

        }

        alert("Payment Verified Successfully!");

        // Later
        // window.location.href = "success.html";

    }

    catch (err) {

        console.error("VERIFY PAYMENT ERROR");

        console.error(err);

        setLoading(false);

        alert("Payment verification failed.");

    }

            },

        modal: {

            ondismiss: function () {

                console.log("Checkout Closed");

                setLoading(false);

            }

        }

    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", function (response) {

        console.error(response.error);

        setLoading(false);

        alert(
            response.error.description ||
            "Payment Failed"
        );

    });

    rzp.open();

}

catch (err) {

    console.error(err);

    setLoading(false);

    alert("Unable to connect to server.");

}

}

// =======================================
// MOBILE NAVIGATION
// =======================================

function initialiseMobileMenu() {

    const menu =
        document.getElementById("mobileMenu");

    const openButton =
        document.getElementById("mobileMenuToggle");

    const closeButton =
        document.getElementById("mobileMenuClose");

    if (!menu || !openButton || !closeButton) {
        return;
    }

    function openMenu() {

        menu.classList.add("active");

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

        openButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow = "hidden";
    }

    function closeMenu() {

        menu.classList.remove("active");

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

        openButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow = "";
    }

    openButton.addEventListener(
        "click",
        openMenu
    );

    closeButton.addEventListener(
        "click",
        closeMenu
    );

    menu.querySelectorAll(
        ".mobile-nav a"
    ).forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });

}

// =======================================
// SAMRAMBA RC2
// MOBILE NAVIGATION
// =======================================

function initialiseRC2Navigation() {

    const menu =
        document.getElementById("rc2MobileMenu");

    const openButton =
        document.getElementById("rc2MenuButton");

    const closeButton =
        document.getElementById("rc2MenuClose");

    const headerCTA =
        document.getElementById("rc2HeaderCTA");

    const mobileCTA =
        document.getElementById("rc2MobileCTA");

    if (
        !menu ||
        !openButton ||
        !closeButton
    ) {
        return;
    }


    function openMenu() {

        menu.classList.add("active");

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

        openButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeMenu() {

        menu.classList.remove("active");

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

        openButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow =
            "";

    }


    openButton.addEventListener(
        "click",
        openMenu
    );


    closeButton.addEventListener(
        "click",
        closeMenu
    );


    menu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    if (headerCTA) {

        headerCTA.addEventListener(
            "click",
            openModal
        );

    }


    if (mobileCTA) {

        mobileCTA.addEventListener(
            "click",
            () => {

                closeMenu();

                openModal();

            }
        );

    }

}

// =======================================
// SAMRAMBA RC2
// DYNAMIC HEADER
// =======================================

function initialiseDynamicHeader() {

    const header =
        document.querySelector(".rc2-header");

    if (!header) {
        return;
    }


    /* ---------------------------------------
       SCROLL BEHAVIOUR
    --------------------------------------- */

    let lastScrollY = window.scrollY;

    let ticking = false;


    function updateHeader() {

        const currentScrollY =
            window.scrollY;


        /* Compact header */

        if (currentScrollY > 20) {

            header.classList.add("is-scrolled");

        } else {

            header.classList.remove("is-scrolled");

        }


        /* Hide when scrolling down */

        if (
            currentScrollY > lastScrollY &&
            currentScrollY > 100
        ) {

            header.classList.add("is-hidden");

        }


        /* Show when scrolling up */

        if (currentScrollY < lastScrollY) {

            header.classList.remove("is-hidden");

        }


        /* Always show at top */

        if (currentScrollY <= 20) {

            header.classList.remove("is-hidden");

        }


        lastScrollY =
            Math.max(currentScrollY, 0);

        ticking = false;

    }


    window.addEventListener(
        "scroll",
        function () {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHeader
                );

                ticking = true;

            }

        },
        { passive: true }
    );


    /* ---------------------------------------
       SMOOTH INTERNAL NAVIGATION
    --------------------------------------- */

    document
        .querySelectorAll(
            '.rc2-desktop-nav a[href^="#"],' +
            '.rc2-mobile-nav a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    const targetID =
                        this.getAttribute("href");

                    if (
                        !targetID ||
                        targetID === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetID
                        );

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header.offsetHeight;


                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        12;


                    window.scrollTo({

                        top: targetPosition,

                        behavior: "smooth"

                    });

                }
            );

        });


    /* ---------------------------------------
       ACTIVE SECTION DETECTION
    --------------------------------------- */

    const navigationLinks =
        document.querySelectorAll(
            '.rc2-desktop-nav a[href^="#"]'
        );


    const sections = [];


    navigationLinks.forEach(link => {

        const targetID =
            link.getAttribute("href");

        if (
            !targetID ||
            targetID === "#"
        ) {
            return;
        }


        const section =
            document.querySelector(
                targetID
            );


        if (section) {

            sections.push({

                section: section,

                link: link

            });

        }

    });


    if (!sections.length) {
        return;
    }


    const sectionObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    navigationLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                    });


                    const matching =
                        sections.find(
                            item =>
                                item.section ===
                                entry.target
                        );


                    if (matching) {

                        matching.link.classList.add(
                            "active"
                        );

                    }

                });

            },

            {

                root: null,

                rootMargin:
                    "-25% 0px -55% 0px",

                threshold: 0

            }

        );


    sections.forEach(item => {

        sectionObserver.observe(
            item.section
        );

    });

}

// =========================================================
// SAMRAMBA RC2
// PREMIUM FABRIC REVEAL — OVERHEAD CURTAIN
// =========================================================

function initialiseUnboxingReveal() {

    const stage =
        document.getElementById("rc2UnboxingStage");

    if (!stage) {
        return;
    }


    /* =====================================================
       PODIUM — DYNAMIC STAGE ELEMENT
    ===================================================== */

    let podium =
        stage.querySelector(".rc2-unboxing-podium");

    if (!podium) {

        podium =
            document.createElement("img");

        podium.className =
            "rc2-unboxing-podium";

        podium.src =
            "SAMRAMBA_RC2_Podium.png";

        podium.alt = "";

        podium.setAttribute(
            "aria-hidden",
            "true"
        );

        stage.appendChild(
            podium
        );
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const hint =
        document.getElementById(
            "rc2UnboxingHint"
        );

    const product =
        document.querySelector(
            ".rc2-unboxing-product"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let current = 0;

    let target = 0;

    let raf = null;


    /* =====================================================
       HELPERS
    ===================================================== */

    function clamp(value) {

        return Math.max(
            0,
            Math.min(1, value)
        );

    }


    function easeOutCubic(t) {

        return 1 -
            Math.pow(
                1 - t,
                3
            );

    }


    function easeInOut(t) {

        return t < 0.5

            ? 2 * t * t

            : 1 -
              Math.pow(
                  -2 * t + 2,
                  2
              ) / 2;

    }


    function section(
        value,
        start,
        end
    ) {

        return clamp(
            (value - start) /
            (end - start)
        );

    }


    /* =====================================================
       UPDATE
    ===================================================== */

    function update(progress) {


        /* =================================================
           PRODUCT
        ================================================= */

        if (product) {

            const reveal =
                easeOutCubic(
                    section(
                        progress,
                        0.18,
                        0.78
                    )
                );


            product.style.transform =
                `
                translate3d(
                    0,
                    ${35 - (6 * reveal)}px,
                    0
                )
                scale(
                    ${1 + (.022 * reveal)}
                )
                `;

        }


        /* =================================================
           SCROLL HINT
        ================================================= */

        if (hint) {

            const fade =
                easeInOut(
                    section(
                        progress,
                        0.00,
                        0.20
                    )
                );


            hint.style.opacity =
                String(
                    1 - fade
                );


            hint.style.transform =
                `
                translate3d(
                    0,
                    ${10 * fade}px,
                    0
                )
                `;

        }

    }


    /* =====================================================
       SMOOTH ANIMATION
    ===================================================== */

    function animate() {

        current +=
            (
                target -
                current
            ) * 0.09;


        if (
            Math.abs(
                target -
                current
            ) < 0.001
        ) {

            current =
                target;

        }


        update(current);


        if (
            Math.abs(
                target -
                current
            ) > 0.001
        ) {

            raf =
                requestAnimationFrame(
                    animate
                );

        } else {

            raf = null;

        }

    }


    /* =====================================================
       CALCULATE SCROLL PROGRESS
    ===================================================== */

    function calculate() {

        const rect =
            stage.getBoundingClientRect();

        const viewport =
            window.innerHeight;


        /* ---------------------------------------------
           HARD LOCK AT TOP
        --------------------------------------------- */

        if (window.scrollY <= 2) {

            target = 0;

        } else {

            const startPoint =
                viewport * 0.72;

            const revealDistance =
                720;


            target =
                clamp(
                    (
                        startPoint -
                        rect.top
                    ) /
                    revealDistance
                );

        }


        if (!raf) {

            raf =
                requestAnimationFrame(
                    animate
                );

        }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    window.addEventListener(
        "scroll",
        calculate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        calculate,
        {
            passive: true
        }
    );


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        current = 1;

        target = 1;

        update(1);

        return;

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    update(0);

    target = 0;

    current = 0;

}

/* =========================================================
   OPPORTUNITIES & UPDATES HUB — V1
========================================================= */

const hubItems = [

    {
        type: "collection",

        label: "NEW ADDITION",

        title: "5 New Learning Guides Added",

        description:
            "Fresh learning resources are now available in the collection.",

        action:
            "Explore Collection",

        link:
            "#featured-modules",

        image:
            "assets/book1.png",

        imageFit:
            "contain"
    },


    {
        type: "opportunity",

        label: "SPEAK WITH IMPACT",

        title: "Public Speaking for Future Entrepreneurs",

        description:
            "Build confidence to present your ideas, communicate your vision, and speak with impact.",

        action:
            "Explore",

        link:
            "#",

        image:
            "assets/p1.png",

        imageFit:
            "contain"
    },

    {
    type:
        "banner",

    image:
        "assets/p2.png",

    imageFit:
        "cover",

    link:
        "#"
}

];


let hubCurrentIndex = 0;
let hubTimer = null;


/* -----------------------------------------
   RENDER HUB
----------------------------------------- */

function initialiseOpportunitiesHub() {

    const track =
        document.getElementById("hubTrack");

    const dots =
        document.getElementById("hubDots");

    if (!track || !dots) return;


    track.innerHTML = "";
    dots.innerHTML = "";


    hubItems.forEach((item, index) => {

        const slide =
            document.createElement("article");

        slide.className =
            "hub-slide";


        /* =====================================================
   RENDER SLIDE
===================================================== */

if (item.type === "banner") {

    slide.classList.add(
        "hub-slide-banner"
    );

    slide.innerHTML = `
        <a
            href="${item.link || "#"}"
            class="hub-banner-link"
        >

            <img
                src="${item.image}"
                alt=""
                class="hub-banner-image"
            >

        </a>
    `;

} else {

    slide.innerHTML = `

        <div class="hub-slide-image">

            ${
                item.image

                ?

                `<img
                    src="${item.image}"
                    alt="${item.title}"
                    class="hub-image hub-image-${item.imageFit}"
                >`

                :

                `<div class="hub-image-placeholder">

                    <i data-lucide="${
                        item.type === "collection"
                        ? "book-open"
                        : "mic-2"
                    }"></i>

                </div>`
            }

        </div>


        <div class="hub-slide-content">

            <span class="hub-slide-label">
                ${item.label}
            </span>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.description}
            </p>

            <a
                href="${item.link}"
                class="hub-slide-button"
            >

                ${item.action}

                <i data-lucide="arrow-right"></i>

            </a>

        </div>

    `;
}


        track.appendChild(slide);


        const dot =
            document.createElement("button");

        dot.type =
            "button";

        dot.className =
            "hub-dot";

        dot.setAttribute(
            "aria-label",
            `Show update ${index + 1}`
        );


        dot.addEventListener(
            "click",
            () => showHubSlide(index)
        );


        dots.appendChild(dot);

    });


    if (window.lucide) {
        lucide.createIcons();
    }


    showHubSlide(0);

    startHubRotation();

}


/* -----------------------------------------
   SHOW SLIDE
----------------------------------------- */

function showHubSlide(index) {

    const track =
        document.getElementById("hubTrack");

    const dots =
        document.querySelectorAll(".hub-dot");

    if (!track) return;


    hubCurrentIndex =
        (index + hubItems.length)
        % hubItems.length;


    track.style.transform =
        `translateX(-${hubCurrentIndex * 100}%)`;


    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === hubCurrentIndex
        );

    });

}


/* -----------------------------------------
   ROTATION
----------------------------------------- */

function startHubRotation() {

    stopHubRotation();


    hubTimer =
        setInterval(() => {

            showHubSlide(
                hubCurrentIndex + 1
            );

        }, 6000);

}


/* -----------------------------------------
   STOP ROTATION
----------------------------------------- */

function stopHubRotation() {

    if (hubTimer) {

        clearInterval(hubTimer);

        hubTimer = null;

    }

}


/* -----------------------------------------
   ARROWS
----------------------------------------- */

document.addEventListener(
    "click",
    function(event) {

        const prev =
            event.target.closest(".hub-prev");

        const next =
            event.target.closest(".hub-next");


        if (prev) {

            showHubSlide(
                hubCurrentIndex - 1
            );

            startHubRotation();

        }


        if (next) {

            showHubSlide(
                hubCurrentIndex + 1
            );

            startHubRotation();

        }

    }
);


/* -----------------------------------------
   INITIALISE
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    initialiseOpportunitiesHub
);