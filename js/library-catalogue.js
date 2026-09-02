/* =========================================================
   SAMRAMBA KERALAM 2030
   LIBRARY CATALOGUE
   ---------------------------------------------------------
   Purpose:
   - Single source of truth for Library book metadata
   - Data-driven rendering for Library Home
   - Designed to scale from prototype to 500+ books
   - Keeps catalogue data separate from user activity data

   IMPORTANT:
   This file contains METADATA only.
   Actual reader content will be connected later through
   contentRef / version records.
========================================================= */

(function () {
    "use strict";


    /* =========================================================
       01. LIBRARY CATEGORIES
    ========================================================= */

    /*
     * Final Library taxonomy.
     *
     * Use the category ID in each book record.
     */
    const CATEGORIES = [
        {
            id: "entrepreneurship",
            name: "Entrepreneurship"
        },
        {
            id: "sales",
            name: "Sales"
        },
        {
            id: "investing",
            name: "Investing"
        },
        {
            id: "marketing",
            name: "Marketing"
        },
        {
            id: "business",
            name: "Business"
        },
        {
            id: "money",
            name: "Money"
        },
        {
            id: "mindset-motivation",
            name: "Mindset & Motivation"
        },
        {
            id: "self-help",
            name: "Self-Help"
        },
        {
            id: "psychology",
            name: "Psychology"
        },
        {
            id: "discipline",
            name: "Discipline"
        },
        {
            id: "health",
            name: "Health"
        },
        {
            id: "wisdom",
            name: "Wisdom"
        }
    ];


    /* =========================================================
       02. PROTOTYPE BOOK CATALOGUE
    ========================================================= */

    /*
     * This is intentionally a small prototype catalogue.
     *
     * We first establish and test the data structure with
     * a limited number of books before entering 500+ books.
     *
     * IMPORTANT:
     * Cover paths are placeholders until the actual approved
     * cover assets are placed in the project.
     *
     * Actual condensed-book content will be connected later
     * through the versions/contentRef structure.
     */

    const BOOKS = [

        /* -----------------------------------------------------
           BOOK 001
        ----------------------------------------------------- */

        {
            id: "book-001",

            title: "Rich Dad Poor Dad",

            author: "Robert T. Kiyosaki",

            category: "money",

            cover: "assets/library/covers/book-001.webp",

            pages: 8,

            popularity: 100,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-001-v1",

                    label: "Condensed Edition",

                    pageCount: 8,

                    contentRef: "book-001-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 002
        ----------------------------------------------------- */

        {
            id: "book-002",

            title: "The Lean Startup",

            author: "Eric Ries",

            category: "entrepreneurship",

            cover: "assets/library/covers/book-002.webp",

            pages: 9,

            popularity: 95,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-002-v1",

                    label: "Condensed Edition",

                    pageCount: 9,

                    contentRef: "book-002-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 003
        ----------------------------------------------------- */

        {
            id: "book-003",

            title: "The Psychology of Money",

            author: "Morgan Housel",

            category: "money",

            cover: "assets/library/covers/book-003.webp",

            pages: 10,

            popularity: 98,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-003-v1",

                    label: "Condensed Edition",

                    pageCount: 10,

                    contentRef: "book-003-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 004
        ----------------------------------------------------- */

        {
            id: "book-004",

            title: "Atomic Habits",

            author: "James Clear",

            category: "discipline",

            cover: "assets/library/covers/book-004.webp",

            pages: 10,

            popularity: 97,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-004-v1",

                    label: "Condensed Edition",

                    pageCount: 10,

                    contentRef: "book-004-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 005
        ----------------------------------------------------- */

        {
            id: "book-005",

            title: "Think and Grow Rich",

            author: "Napoleon Hill",

            category: "mindset-motivation",

            cover: "assets/library/covers/book-005.webp",

            pages: 9,

            popularity: 96,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-005-v1",

                    label: "Condensed Edition",

                    pageCount: 9,

                    contentRef: "book-005-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 006
        ----------------------------------------------------- */

        {
            id: "book-006",

            title: "How to Win Friends and Influence People",

            author: "Dale Carnegie",

            category: "psychology",

            cover: "assets/library/covers/book-006.webp",

            pages: 10,

            popularity: 94,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-006-v1",

                    label: "Condensed Edition",

                    pageCount: 10,

                    contentRef: "book-006-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 007
        ----------------------------------------------------- */

        {
            id: "book-007",

            title: "The 7 Habits of Highly Effective People",

            author: "Stephen R. Covey",

            category: "self-help",

            cover: "assets/library/covers/book-007.webp",

            pages: 11,

            popularity: 93,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-007-v1",

                    label: "Condensed Edition",

                    pageCount: 11,

                    contentRef: "book-007-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 008
        ----------------------------------------------------- */

        {
            id: "book-008",

            title: "The 4-Hour Workweek",

            author: "Timothy Ferriss",

            category: "business",

            cover: "assets/library/covers/book-008.webp",

            pages: 9,

            popularity: 91,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-008-v1",

                    label: "Condensed Edition",

                    pageCount: 9,

                    contentRef: "book-008-v1"
                }
            ]
        },


        /* -----------------------------------------------------
           BOOK 009
        ----------------------------------------------------- */

        {
            id: "book-009",

            title: "Influence",

            author: "Robert B. Cialdini",

            category: "sales",

            cover: "assets/library/covers/book-009.webp",

            pages: 10,

            popularity: 90,

            releaseDate: "2026-09-01",

            isNew: true,

            isLocked: true,

            versions: [
                {
                    id: "book-009-v1",

                    label: "Condensed Edition",

                    pageCount: 10,

                    contentRef: "book-009-v1"
                }
            ]
        }

    ];


    /* =========================================================
       03. CATALOGUE VALIDATION
    ========================================================= */

    /*
     * This validation function helps us catch mistakes when
     * the catalogue becomes large.
     *
     * It checks:
     * - Missing book IDs
     * - Duplicate book IDs
     * - Missing titles
     * - Missing authors
     * - Invalid category IDs
     * - Missing versions
     * - Missing version IDs
     * - Missing content references
     */

    function validateCatalogue(books) {

        const categoryIds =
            new Set(
                CATEGORIES.map(
                    function (category) {
                        return category.id;
                    }
                )
            );


        const bookIds =
            new Set();


        const errors = [];


        books.forEach(
            function (book, index) {

                /* ---------------------------------------------
                   Book ID
                --------------------------------------------- */

                if (!book.id) {

                    errors.push(
                        `Book at index ${index} has no ID.`
                    );

                } else if (
                    bookIds.has(book.id)
                ) {

                    errors.push(
                        `Duplicate book ID: ${book.id}`
                    );

                } else {

                    bookIds.add(book.id);

                }


                /* ---------------------------------------------
                   Title
                --------------------------------------------- */

                if (!book.title) {

                    errors.push(
                        `${book.id || "Unknown book"} has no title.`
                    );

                }


                /* ---------------------------------------------
                   Author
                --------------------------------------------- */

                if (!book.author) {

                    errors.push(
                        `${book.id || "Unknown book"} has no author.`
                    );

                }


                /* ---------------------------------------------
                   Category
                --------------------------------------------- */

                if (
                    !book.category ||
                    !categoryIds.has(book.category)
                ) {

                    errors.push(
                        `${book.id || "Unknown book"} has an invalid category.`
                    );

                }


                /* ---------------------------------------------
                   Versions
                --------------------------------------------- */

                if (
                    !Array.isArray(book.versions)
                ) {

                    errors.push(
                        `${book.id || "Unknown book"} has no versions array.`
                    );

                }


                /* ---------------------------------------------
                   Version validation
                --------------------------------------------- */

                if (
                    Array.isArray(book.versions)
                ) {

                    book.versions.forEach(
                        function (version) {

                            if (!version.id) {

                                errors.push(
                                    `${book.id || "Unknown book"} has a version without an ID.`
                                );

                            }


                            if (!version.contentRef) {

                                errors.push(
                                    `${book.id || "Unknown book"} has a version without contentRef.`
                                );

                            }

                        }
                    );

                }

            }
        );


        /* ---------------------------------------------
           Console output
        --------------------------------------------- */

        if (errors.length) {

            console.warn(
                "SAMRAMBA Library catalogue validation warnings:",
                errors
            );

        } else {

            console.info(
                `SAMRAMBA Library catalogue validated: ${books.length} books.`
            );

        }


        return {
            valid: errors.length === 0,

            errors: errors
        };

    }


    /* =========================================================
       04. PUBLIC CATALOGUE API
    ========================================================= */

    /*
     * This keeps catalogue access organized.
     *
     * library.js does not need to know how the catalogue
     * itself is structured internally.
     */

    window.SamrambaLibraryCatalogue = {

        /* ---------------------------------------------
           All categories
        --------------------------------------------- */

        categories: CATEGORIES,


        /* ---------------------------------------------
           All books
        --------------------------------------------- */

        books: BOOKS,


        /* ---------------------------------------------
           Validate catalogue
        --------------------------------------------- */

        validate: function () {

            return validateCatalogue(
                BOOKS
            );

        },


        /* ---------------------------------------------
           Find a single book
        --------------------------------------------- */

        getBook: function (bookId) {

            return BOOKS.find(
                function (book) {

                    return book.id === bookId;

                }
            ) || null;

        },


        /* ---------------------------------------------
           Find a category
        --------------------------------------------- */

        getCategory: function (categoryId) {

            return CATEGORIES.find(
                function (category) {

                    return category.id === categoryId;

                }
            ) || null;

        },


        /* ---------------------------------------------
           Find books by category
        --------------------------------------------- */

        getBooksByCategory: function (categoryId) {

            return BOOKS.filter(
                function (book) {

                    return book.category === categoryId;

                }
            );

        }

    };


    /* =========================================================
       05. LIBRARY.JS COMPATIBILITY
    ========================================================= */

    /*
     * The existing library.js already looks for:
     *
     *     window.LIBRARY_BOOKS
     *
     * So expose the catalogue there.
     *
     * This allows library.js to remain focused on UI and
     * interaction while this file remains the catalogue source.
     */

    window.LIBRARY_BOOKS = BOOKS;


    /* =========================================================
       06. INITIAL VALIDATION
    ========================================================= */

    /*
     * Validate the prototype catalogue once when this file
     * loads.
     */

    validateCatalogue(
        BOOKS
    );


})();