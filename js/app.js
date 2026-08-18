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

// =======================================
// SAMRAMBA RC2
// 3D UNBOXING REVEAL — FABRIC MOTION
// =======================================

function initialiseUnboxingReveal() {

    const stage =
        document.getElementById("rc2UnboxingStage");

    const cloth =
        document.getElementById("rc2UnboxingCloth");

    const leftCloth =
        document.querySelector(".rc2-cloth-left");

    const rightCloth =
        document.querySelector(".rc2-cloth-right");

    const frontCloth =
        document.querySelector(".rc2-cloth-front");

    const hint =
        document.getElementById("rc2UnboxingHint");

    const product =
        document.querySelector(".rc2-unboxing-product");

    const spotlight =
        document.querySelector(".rc2-unboxing-spotlight");


    /* ---------------------------------------
       SAFETY CHECK
    --------------------------------------- */

    if (
        !stage ||
        !cloth ||
        !leftCloth ||
        !rightCloth ||
        !frontCloth
    ) {
        return;
    }


    /* ---------------------------------------
       STATE
    --------------------------------------- */

    let revealProgress = 0;

    let targetProgress = 0;

    let animationFrame = null;


    /* ---------------------------------------
       CONFIGURATION
    --------------------------------------- */

    const REVEAL_DISTANCE = 700;

    const SIDE_DISTANCE = 165;

    const FRONT_DISTANCE = 155;


    /* ---------------------------------------
       HELPERS
    --------------------------------------- */

    function clamp(value, min, max) {

        return Math.min(
            Math.max(value, min),
            max
        );

    }


    function easeOutCubic(value) {

        return 1 -
            Math.pow(
                1 - value,
                3
            );

    }


    function easeInOut(value) {

        return value < 0.5

            ? 2 * value * value

            : 1 -
              Math.pow(
                  -2 * value + 2,
                  2
              ) / 2;

    }


    /*
       Convert a global reveal value into
       a smaller animation window.
    */

    function segment(
        progress,
        start,
        end
    ) {

        return clamp(
            (progress - start) /
            (end - start),
            0,
            1
        );

    }


    /* ---------------------------------------
       VISUAL UPDATE
    --------------------------------------- */

    function updateReveal(progress) {

        /*
           =====================================
           SIDE FABRIC
           =====================================
           
           The side fabric begins peeling
           before the front drape falls.
        */

        const sideProgress =
            easeInOut(
                segment(
                    progress,
                    0.08,
                    0.78
                )
            );


        const sideDistance =
            SIDE_DISTANCE *
            sideProgress;


        /*
           LEFT
        */

        leftCloth.style.transform =
            `
            translate3d(
                ${-sideDistance}px,
                ${-7 * sideProgress}px,
                0
            )
            rotate(
                ${7 * sideProgress}deg
            )
            scaleX(
                ${1 - (0.08 * sideProgress)}
            )
            `;


        /*
           RIGHT
        */

        rightCloth.style.transform =
            `
            translate3d(
                ${sideDistance}px,
                ${-7 * sideProgress}px,
                0
            )
            rotate(
                ${-7 * sideProgress}deg
            )
            scaleX(
                ${1 - (0.08 * sideProgress)}
            )
            `;


        /*
           =====================================
           FRONT DRAPE
           =====================================
           
           The front fabric waits briefly,
           then falls.
        */

        const frontProgress =
            easeInOut(
                segment(
                    progress,
                    0.38,
                    0.92
                )
            );


        const frontDistance =
            FRONT_DISTANCE *
            frontProgress;


        frontCloth.style.transform =
            `
            translate3d(
                0,
                ${frontDistance}px,
                0
            )
            rotate(
                ${1.8 * frontProgress}deg
            )
            scaleY(
                ${1 - (0.10 * frontProgress)}
            )
            `;


        /*
           =====================================
           PRODUCT
           =====================================
           
           Very subtle forward emphasis.
        */

        if (product) {

            const productProgress =
                easeOutCubic(
                    segment(
                        progress,
                        0.15,
                        0.85
                    )
                );


            const scale =
                1 +
                (0.025 * productProgress);


            const lift =
                -8 -
                (4 * productProgress);


            product.style.transform =
                `
                translate3d(
                    0,
                    ${lift}px,
                    0
                )
                scale(${scale})
                `;

        }


        /*
           =====================================
           SPOTLIGHT
           =====================================
        */

        if (spotlight) {

            const lightProgress =
                easeOutCubic(progress);


            spotlight.style.opacity =
                String(
                    0.78 +
                    (0.22 * lightProgress)
                );


            spotlight.style.transform =
                `
                scale(
                    ${1 +
                    (0.10 * lightProgress)}
                )
                `;

        }


        /*
           =====================================
           REVEAL HINT
           =====================================
        */

        if (hint) {

            const hintProgress =
                easeInOut(
                    segment(
                        progress,
                        0.02,
                        0.42
                    )
                );


            hint.style.opacity =
                String(
                    1 -
                    hintProgress
                );


            hint.style.transform =
                `
                translate3d(
                    0,
                    ${10 * hintProgress}px,
                    0
                )
                `;

        }

    }


    /* ---------------------------------------
       SMOOTH ANIMATION
    --------------------------------------- */

    function animate() {

        revealProgress +=
            (
                targetProgress -
                revealProgress
            ) * 0.085;


        if (
            Math.abs(
                targetProgress -
                revealProgress
            ) < 0.001
        ) {

            revealProgress =
                targetProgress;

        }


        updateReveal(
            revealProgress
        );


        if (
            Math.abs(
                targetProgress -
                revealProgress
            ) > 0.001
        ) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

        } else {

            animationFrame =
                null;

        }

    }


    /* ---------------------------------------
       CALCULATE SCROLL PROGRESS
    --------------------------------------- */

    function calculateReveal() {

        const rect =
            stage.getBoundingClientRect();


        /*
           Progress is based on how far the
           exhibition stage has travelled
           through the viewport.
        */

        const viewportHeight =
            window.innerHeight;


        const travelled =
            viewportHeight -
            rect.top;


        targetProgress =
            clamp(
                travelled /
                REVEAL_DISTANCE,
                0,
                1
            );


        /*
           Start animation loop only when needed.
        */

        if (!animationFrame) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

        }

    }


    /* ---------------------------------------
       SCROLL
    --------------------------------------- */

    window.addEventListener(
        "scroll",
        calculateReveal,
        {
            passive: true
        }
    );


    /* ---------------------------------------
       RESIZE
    --------------------------------------- */

    window.addEventListener(
        "resize",
        calculateReveal,
        {
            passive: true
        }
    );


    /* ---------------------------------------
       REDUCED MOTION
    --------------------------------------- */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        revealProgress = 1;

        targetProgress = 1;

        updateReveal(1);

        return;

    }


    /* ---------------------------------------
       INITIAL STATE
    --------------------------------------- */

    updateReveal(0);

}