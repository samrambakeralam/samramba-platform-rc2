/* =========================================
   SAMRAMBA COMMUNITY DATA
========================================= */

const COMMUNITY_DATA = [

    {
        id: "endorse-1",

        type: "endorsement",

        title:
            "SAMRAMBA KERALA 2030",

        caption:
            "Building connections through meaningful conversations.",

        image:
            "assets/community/endorse-1.jpg",

        badge:
            "COMMUNITY",

        active:
            true
    },


    {
        id: "endorse-2",

        type: "institutional",

        title:
            "Institutional Engagement",

        caption:
            "Connecting with local institutions and communities.",

        image:
            "assets/community/endorse-2.jpg",

        badge:
            "INSTITUTIONAL",

        active:
            true
    }

];

/* =========================================
   COMMUNITY ENGINE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const grid =
            document.getElementById("rc2CommunityGrid");

        const emptyState =
            document.getElementById("rc2CommunityEmpty");

        const filters =
            document.querySelectorAll(
                ".rc2-community-filter"
            );


        if (!grid) {
            return;
        }


        let currentFilter = "all";


        /* =========================================
           GET ACTIVE COMMUNITY ITEMS
        ========================================= */

        function getFilteredItems() {

            return COMMUNITY_DATA.filter(
                function (item) {

                    if (!item.active) {
                        return false;
                    }

                    if (currentFilter === "all") {
                        return true;
                    }

                    return item.type === currentFilter;

                }
            );

        }


        /* =========================================
           RENDER COMMUNITY CARDS
        ========================================= */

        function renderCommunity() {

            const items =
                getFilteredItems();


            grid.innerHTML = "";


            if (!items.length) {

                if (emptyState) {
                    emptyState.hidden = false;
                }

                return;

            }


            if (emptyState) {
                emptyState.hidden = true;
            }


            items.forEach(
                function (item) {

                    const card =
                        document.createElement("article");


                    card.className =
                        "rc2-community-card";


                    card.innerHTML = `

                        <div class="rc2-community-image-wrap">

                            <img
                                src="${item.image}"
                                alt="${item.title}"
                                class="rc2-community-image"
                                loading="lazy"
                            >

                            <span
                                class="rc2-community-card-badge"
                            >
                                ${item.badge}
                            </span>

                        </div>


                        <div class="rc2-community-card-content">

                            <h3>
                                ${item.title}
                            </h3>

                            <p>
                                ${item.caption}
                            </p>

                        </div>

                    `;


                    grid.appendChild(card);

                }
            );


            if (
                typeof lucide !== "undefined"
            ) {

                lucide.createIcons();

            }

        }


        /* =========================================
           FILTER BUTTONS
        ========================================= */

        filters.forEach(
            function (filterButton) {

                filterButton.addEventListener(
                    "click",
                    function () {

                        currentFilter =
                            this.dataset.communityFilter;


                        filters.forEach(
                            function (button) {

                                button.classList.remove(
                                    "active"
                                );

                            }
                        );


                        this.classList.add(
                            "active"
                        );


                        renderCommunity();

                    }
                );

            }
        );


        /* =========================================
           INITIAL RENDER
        ========================================= */

        renderCommunity();

    }
);