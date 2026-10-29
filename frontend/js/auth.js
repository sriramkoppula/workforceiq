(function () {

    "use strict";

    /* ==========================================
       PROTECTED PAGES
    ========================================== */

    const protectedPages = [
        "profile.html",
        "dashboard.html",
        "skills.html",
        "skill-detail.html",
        "evidence.html",
        "roadmap.html",
        "progress.html",
        "learning.html",
        "skill-learning.html",
        "topic.html",
        "practice.html",
        "projects.html",
        "assessment.html",
        "study-plan.html"
    ];

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    /* ==========================================
       GET LOGGED-IN USER
    ========================================== */

    function getLoggedInUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "workforceLoggedInUser"
                )
            );

        } catch (error) {

            return null;
        }
    }

    /* ==========================================
       AUTHENTICATION CHECK
    ========================================== */

    function checkAuthentication() {

        const user =
            getLoggedInUser();

        if (
            protectedPages.includes(currentPage) &&
            !user
        ) {

            window.location.href =
                "login.html";

            return false;
        }

        return true;
    }

    /* ==========================================
       LOGOUT
    ========================================== */

    window.logout = function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmLogout) {
            return;
        }

        /*
         * Remove login session.
         *
         * We intentionally keep:
         * - workforceProfile
         * - workforceSkills
         * - workforceEvidence
         *
         * so the user's application data
         * is not accidentally deleted.
         */

        localStorage.removeItem(
            "workforceLoggedInUser"
        );

        localStorage.removeItem(
            "workforceRememberMe"
        );
        localStorage.removeItem("workforceProfile");
        localStorage.removeItem("workforceProfileCachedAt");
        localStorage.removeItem("workforceSkills");
        localStorage.removeItem("workforceSkillsUserId");
        localStorage.removeItem("workforceEvidence");
        localStorage.removeItem("workforceEvidenceUserId");
        localStorage.removeItem("workforcePerformanceSummary");
        localStorage.removeItem("workforceSummaryUserId"
        );

        window.location.href =
            "login.html";
    };

    /* ==========================================
       ESCAPE HTML
    ========================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ==========================================
       USER MENU
    ========================================== */

    function setupUserMenu() {

        const userCircle =
            document.querySelector(
                ".user-circle"
            );

        if (!userCircle) {
            return;
        }

        /*
         * Prevent duplicate menus.
         */

        if (
            document.querySelector(
                ".workforce-user-menu"
            )
        ) {
            return;
        }

        const user =
            getLoggedInUser();

        if (!user) {
            return;
        }

        const name =
            user.name || "User";

        const email =
            user.email || "";

        const initials =
            name
                .trim()
                .split(/\s+/)
                .map(function (word) {
                    return word.charAt(0);
                })
                .join("")
                .substring(0, 2)
                .toUpperCase();

        /* ==========================================
           CONTAINER
        ========================================== */

        const container =
            document.createElement("div");

        container.className =
            "workforce-user-menu";

        /* ==========================================
           USER BUTTON
        ========================================== */

        const button =
            document.createElement("button");

        button.className =
            "workforce-user-button";

        button.type = "button";

        button.innerHTML = `
            <span class="workforce-avatar">
                ${escapeHTML(initials)}
            </span>
            <span class="workforce-user-arrow">▾</span>
        `;

        /* ==========================================
           DROPDOWN
        ========================================== */

        const dropdown =
            document.createElement("div");

        dropdown.className =
            "workforce-user-dropdown";

        dropdown.innerHTML = `
            <div class="workforce-user-info">
                <div class="workforce-dropdown-avatar">
                    ${escapeHTML(initials)}
                </div>

                <div>
                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <small>
                        ${escapeHTML(email)}
                    </small>
                </div>
            </div>

            <div class="workforce-menu-divider"></div>

            <a href="profile.html">
                👤 My Profile
            </a>

            <a href="dashboard.html">
                📊 Dashboard
            </a>

            <a href="progress.html">
                📈 Progress
            </a>

            <button
                type="button"
                class="workforce-logout-button"
                id="workforceLogoutButton">
                🚪 Logout
            </button>
        `;

        /* ==========================================
           ADD TO PAGE
        ========================================== */

        userCircle.style.display = "none";

        container.appendChild(button);
        container.appendChild(dropdown);

        userCircle.parentNode.insertBefore(
            container,
            userCircle
        );

        /* ==========================================
           TOGGLE MENU
        ========================================== */

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                dropdown.classList.toggle(
                    "show"
                );
            }
        );

        /* ==========================================
           LOGOUT BUTTON
        ========================================== */

        const logoutButton =
            dropdown.querySelector(
                "#workforceLogoutButton"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    window.logout();
                }
            );
        }

        /* ==========================================
           CLOSE WHEN CLICKING OUTSIDE
        ========================================== */

        document.addEventListener(
            "click",
            function () {

                dropdown.classList.remove(
                    "show"
                );
            }
        );
    }

    /* ==========================================
       USER MENU CSS
    ========================================== */

    function addUserMenuStyles() {

        if (
            document.getElementById(
                "workforceUserMenuStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "workforceUserMenuStyles";

        style.textContent = `

            .workforce-user-menu {
                position: relative;
                display: inline-block;
                margin-left: 10px;
            }

            .workforce-user-button {
                border: none;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 7px;
                padding: 4px;
            }

            .workforce-avatar {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #2563eb;
                color: white;
                font-weight: 700;
                font-size: 14px;
            }

            .workforce-user-arrow {
                color: #64748b;
                font-size: 14px;
            }

            .workforce-user-dropdown {
                position: absolute;
                right: 0;
                top: calc(100% + 10px);
                width: 250px;
                background: white;
                border-radius: 12px;
                box-shadow:
                    0 10px 30px rgba(0,0,0,0.15);
                border: 1px solid #e2e8f0;
                padding: 8px;
                z-index: 9999;
                display: none;
            }

            .workforce-user-dropdown.show {
                display: block;
            }

            .workforce-user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
            }

            .workforce-dropdown-avatar {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: #2563eb;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
            }

            .workforce-user-info strong {
                display: block;
                color: #1e293b;
                font-size: 14px;
            }

            .workforce-user-info small {
                display: block;
                color: #64748b;
                font-size: 12px;
                margin-top: 3px;
                word-break: break-word;
            }

            .workforce-menu-divider {
                height: 1px;
                background: #e2e8f0;
                margin: 5px 0;
            }

            .workforce-user-dropdown a,
            .workforce-logout-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
                padding: 10px 12px;
                border: none;
                background: transparent;
                text-align: left;
                text-decoration: none;
                color: #334155;
                font-size: 14px;
                border-radius: 8px;
                cursor: pointer;
            }

            .workforce-user-dropdown a:hover,
            .workforce-logout-button:hover {
                background: #f1f5f9;
            }

            .workforce-logout-button {
                color: #dc2626;
            }

        `;

        document.head.appendChild(style);
    }

    /* ==========================================
       INITIALIZE
    ========================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            if (!checkAuthentication()) {
                return;
            }

            addUserMenuStyles();
            setupUserMenu();
        }
    );

})();