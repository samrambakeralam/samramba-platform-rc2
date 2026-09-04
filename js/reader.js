(function () {
    "use strict";


    /* =========================================================
       CONFIG
    ========================================================= */

    const LIBRARY_API_URL =
        "https://script.google.com/macros/s/" +
        "AKfycbzQFLeWMQAX7gbedsu859N8nEZnGoAFinj4dn1JgpX0La7GSy-2xGHK38MdjcHM2ckk/" +
        "exec";


    /* =========================================================
       URL PARAMETERS
    ========================================================= */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const customerID =
        params.get("cid") || "";

    const token =
        params.get("t") || "";

    const bookID =
        params.get("bookId") || "";

    const versionID =
        params.get("versionId") || "";

        const themePrimary =
        params.get("themePrimary") || "";

    const themeSecondary =
        params.get("themeSecondary") || "";


        const libraryParams =
    new URLSearchParams();

if (customerID) {
    libraryParams.set(
        "cid",
        customerID
    );
}

if (token) {
    libraryParams.set(
        "t",
        token
    );
}

const libraryURL =
    "library.html" +
    (
        libraryParams.toString()
            ? "?" + libraryParams.toString()
            : ""
    );

    /* =========================================================
       DOM
    ========================================================= */

    const content =
        document.getElementById(
            "readerContent"
        );

    const title =
        document.getElementById(
            "readerBookTitle"
        );

    const author =
        document.getElementById(
            "readerBookAuthor"
        );

    const pageIndicator =
        document.getElementById(
            "readerPageIndicator"
        );

    const pageDots =
    document.getElementById(
        "readerPageDots"
    );

        const backButton =
    document.getElementById(
        "readerBackButton"
    );


    /* =========================================================
       READER STATE
    ========================================================= */

    let pages = [];

    let currentPageIndex = 0;


    /* =========================================================
   BOOK THEME
========================================================= */

if (themePrimary) {

    document.documentElement.style.setProperty(
        "--reader-theme-primary",
        themePrimary
    );

}


if (themeSecondary) {

    document.documentElement.style.setProperty(
        "--reader-theme-secondary",
        themeSecondary
    );

}


    /* =========================================================
       HELPERS
    ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       LOAD BOOK
    ========================================================= */

    async function loadBook() {

        if (
            !customerID ||
            !token ||
            !bookID ||
            !versionID
        ) {

            showError(
                "This reading session is missing required access information."
            );

            return;
        }


        try {

            const url =
                LIBRARY_API_URL +
                "?action=bookcontent" +
                "&cid=" +
                encodeURIComponent(customerID) +
                "&t=" +
                encodeURIComponent(token) +
                "&bookId=" +
                encodeURIComponent(bookID) +
                "&versionId=" +
                encodeURIComponent(versionID);


            const response =
                await fetch(url);


            if (!response.ok) {
                throw new Error(
                    "Unable to connect to the Library."
                );
            }


            const data =
                await response.json();


            if (!data.success) {

                showError(
                    data.message ||
                    "Unable to load this book."
                );

                return;
            }


            pages =
                Array.isArray(data.pages)
                    ? data.pages
                    : [];


            if (!pages.length) {

                showError(
                    "No reading content is available for this book."
                );

                return;
            }


            renderPage();

        } catch (error) {

            console.error(
                "Reader error:",
                error
            );

            showError(
                "Unable to load the book. Please try again."
            );

        }

    }


    /* =========================================================
       RENDER PAGE
    ========================================================= */

    function renderPage() {

        const page =
            pages[currentPageIndex];


        if (!page) {
            return;
        }


        content.innerHTML =
            page.blocks
                .map(function (block) {

                    return renderBlock(block);

                })
                .join("");


        pageIndicator.textContent =
            "Page " +
            page.page +
            " / " +
            pages.length;


        renderPageDots();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function renderPageDots() {

    if (!pageDots) {
        return;
    }

    pageDots.innerHTML =
        pages
            .map(
                (_, index) => `
                    <button
                        type="button"
                        class="reader-page-dot ${
                            index === currentPageIndex
                                ? "is-active"
                                : ""
                        }"
                        data-page-index="${index}"
                        aria-label="Go to page ${index + 1}"
                        aria-current="${
                            index === currentPageIndex
                                ? "page"
                                : "false"
                        }"
                    ></button>
                `
            )
            .join("");

    pageDots
        .querySelectorAll(
            ".reader-page-dot"
        )
        .forEach(
            dot => {

                dot.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                dot.dataset.pageIndex
                            );

                        goToPage(index);
                    }
                );

            }
        );
}


function goToPage(index) {

    if (
        index < 0 ||
        index >= pages.length ||
        index === currentPageIndex
    ) {
        return;
    }

    currentPageIndex = index;

    renderPage();
}


    /* =========================================================
       RENDER BLOCK
    ========================================================= */

    function renderBlock(block) {

        const text =
            escapeHTML(
                block.content
            );


        switch (block.type) {

            case "title":

                title.textContent =
                    block.content;

                return `
                    <div class="reader-block reader-title">
                        ${text}
                    </div>
                `;


            case "author":

                author.textContent =
                    block.content;

                return "";


            case "heading":

                return `
                    <h2 class="reader-block reader-heading">
                        ${text}
                    </h2>
                `;


            case "paragraph":

                return `
                    <p class="reader-block reader-paragraph">
                        ${text}
                    </p>
                `;


            case "list":

                return `
                    <div class="reader-block reader-list-item">
                        <span>•</span>
                        <span>${text}</span>
                    </div>
                `;


            case "quote":

                return `
                    <blockquote class="reader-block reader-quote">
                        ${text}
                    </blockquote>
                `;


            case "takeaway":

                return `
                    <div class="reader-block reader-takeaway">
                        ${text}
                    </div>
                `;


            case "comparison":

                return `
                    <div class="reader-block reader-comparison">

                        ${
                            block.label
                                ? `
                                    <strong>
                                        ${escapeHTML(block.label)}
                                    </strong>
                                  `
                                : ""
                        }

                        <span>
                            ${text}
                        </span>

                    </div>
                `;

                case "visual":

    return renderVisualBlock(block);

    case "cover":
    return renderCoverBlock(block);


            default:

                return `
                    <p class="reader-block reader-paragraph">
                        ${text}
                    </p>
                `;

        }

    }


    /* =========================================================
   RENDER VISUAL BLOCK
========================================================= */

function renderVisualBlock(block) {

    let visualData;

    try {
        visualData =
            typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;
    } catch (error) {
        console.error(
            "Invalid visual block data:",
            error
        );
        return "";
    }

    if (
        !visualData ||
        !visualData.type
    ) {
        return "";
    }

    switch (visualData.type) {

        case "image":
            return renderImageVisual(
                visualData
            );

        default:
            console.warn(
                "Unknown visual type:",
                visualData.type
            );
            return "";
    }
}


function renderImageVisual(data) {

    const src =
        String(
            data.src || ""
        ).trim();

    if (!src) {
        console.warn(
            "Visual image source is missing."
        );
        return "";
    }

    const alt =
        escapeHTML(
            data.alt ||
            "Learning infographic"
        );

    const caption =
        escapeHTML(
            data.caption || ""
        );

    return `
        <figure class="reader-visual-image">

            <img
                src="${src}"
                alt="${alt}"
                loading="lazy"
                decoding="async"
            >

            ${
                caption
                    ? `
                        <figcaption>
                            ${caption}
                        </figcaption>
                      `
                    : ""
            }

        </figure>
    `;
}


function renderCoverBlock(block) {

    let coverData;

    try {
        coverData =
            typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;
    } catch (error) {

        console.error(
            "Invalid cover block data:",
            error
        );

        return "";
    }

    if (!coverData) {
        return "";
    }

    const src =
        String(
            coverData.src || ""
        ).trim();

    if (!src) {

        console.warn(
            "Cover image source is missing."
        );

        return "";
    }

    const alt =
        escapeHTML(
            coverData.alt ||
            "Book cover"
        );

    return `
        <div class="reader-cover">

            <img
                src="${src}"
                alt="${alt}"
                loading="eager"
                decoding="async"
            >

        </div>
    `;
}


    /* =========================================================
       ERROR
    ========================================================= */

    function showError(message) {

    content.innerHTML = `
        <div class="reader-error">

            <h2>
                Unable to open this book
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <a href="${escapeHTML(libraryURL)}">
                Return to Library
            </a>

        </div>
    `;

}


    /* =========================================================
       NAVIGATION
    ========================================================= */

    backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            libraryURL;

    }
);


/* =========================================================
   TOUCH SWIPE NAVIGATION
========================================================= */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

content.addEventListener(
    "touchstart",
    event => {

        if (
            !event.touches ||
            !event.touches.length
        ) {
            return;
        }

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;
    },
    {
        passive: true
    }
);


content.addEventListener(
    "touchend",
    event => {

        if (
            !event.changedTouches ||
            !event.changedTouches.length
        ) {
            return;
        }

        touchEndX =
            event.changedTouches[0].clientX;

        touchEndY =
            event.changedTouches[0].clientY;

        handleSwipe();
    },
    {
        passive: true
    }
);


function handleSwipe() {

    const deltaX =
        touchEndX - touchStartX;

    const deltaY =
        touchEndY - touchStartY;

    const minimumSwipeDistance = 50;

    /*
     * Ignore mostly-vertical gestures.
     */
    if (
        Math.abs(deltaX) <=
        Math.abs(deltaY)
    ) {
        return;
    }

    /*
     * Ignore very short horizontal movements.
     */
    if (
        Math.abs(deltaX) <
        minimumSwipeDistance
    ) {
        return;
    }

    if (deltaX < 0) {

        /*
         * Swipe left → next page
         */
        goToPage(
            currentPageIndex + 1
        );

    } else {

        /*
         * Swipe right → previous page
         */
        goToPage(
            currentPageIndex - 1
        );
    }
}


    /* =========================================================
       START
    ========================================================= */

    loadBook();

})();