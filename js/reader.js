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

    const previousButton =
        document.getElementById(
            "readerPrevious"
        );

    const nextButton =
        document.getElementById(
            "readerNext"
        );


    /* =========================================================
       READER STATE
    ========================================================= */

    let pages = [];

    let currentPageIndex = 0;


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


        previousButton.disabled =
            currentPageIndex === 0;


        nextButton.disabled =
            currentPageIndex ===
            pages.length - 1;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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


            default:

                return `
                    <p class="reader-block reader-paragraph">
                        ${text}
                    </p>
                `;

        }

    }


    /* =========================================================
       ERROR
    ========================================================= */

    function showError(message) {

        content.innerHTML = `
            <div class="reader-error">
                <h2>Unable to open this book</h2>
                <p>
                    ${escapeHTML(message)}
                </p>
                <a href="library.html">
                    Return to Library
                </a>
            </div>
        `;

    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    previousButton.addEventListener(
        "click",
        function () {

            if (currentPageIndex <= 0) {
                return;
            }

            currentPageIndex--;

            renderPage();

        }
    );


    nextButton.addEventListener(
        "click",
        function () {

            if (
                currentPageIndex >=
                pages.length - 1
            ) {
                return;
            }

            currentPageIndex++;

            renderPage();

        }
    );


    /* =========================================================
       START
    ========================================================= */

    loadBook();

})();