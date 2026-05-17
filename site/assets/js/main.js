/*
 * WebExpress landing — local-only behavior.
 * No network requests, no analytics, no cookies, no storage access.
 */
(function () {
    "use strict";

    // mobile menu toggle
    var toggle = document.querySelector(".site-nav__toggle");
    var menu = document.getElementById("primary-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            var open = menu.getAttribute("data-open") === "true";
            menu.setAttribute("data-open", open ? "false" : "true");
            toggle.setAttribute("aria-expanded", open ? "false" : "true");
        });

        // close the menu when a link inside it is activated
        menu.addEventListener("click", function (event) {
            var target = event.target;
            if (target && target.tagName === "A") {
                menu.setAttribute("data-open", "false");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // keep the copyright year in sync without exposing any external data
    var yearNodes = document.querySelectorAll("[data-current-year]");
    if (yearNodes.length > 0) {
        var year = String(new Date().getFullYear());
        for (var i = 0; i < yearNodes.length; i++) {
            yearNodes[i].textContent = year;
        }
    }
})();
