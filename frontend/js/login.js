document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const rememberMe = document.getElementById("rememberMe");

        const email =
            emailInput ? emailInput.value.trim() : "";

        const password =
            passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const loginButton =
            loginForm.querySelector("button[type='submit']");

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        let warmUpTimer = setTimeout(function () {
            if (loginButton && loginButton.disabled) {
                loginButton.textContent = "Connecting to server...";
            }
        }, 3000);

        try {

            const response = await fetch(
                (window.API_URL || "http://localhost:8080/api") + "/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data =
                await response.json().catch(function () {
                    return null;
                });

            if (!response.ok) {

                const message =
                    typeof data === "string"
                        ? data
                        : data && data.message
                            ? data.message
                            : "Invalid email or password.";

                alert(message);
                return;
            }

            /*
             * Store only the information needed
             * by the frontend session.
             */

            // Clear previous user's cached data on account switch
            try {
                const prevUser = JSON.parse(localStorage.getItem("workforceLoggedInUser") || "null");
                if (prevUser && prevUser.id !== data.id) {
                    localStorage.removeItem("workforceProfile");
                    localStorage.removeItem("workforceProfileCachedAt");
                    localStorage.removeItem("workforceSkills");
                    localStorage.removeItem("workforceSkillsUserId");
                    localStorage.removeItem("workforceEvidence");
                    localStorage.removeItem("workforceEvidenceUserId");
                    localStorage.removeItem("workforcePerformanceSummary");
                    localStorage.removeItem("workforceSummaryUserId");
                }
            } catch (_) {}

            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email
            };

            localStorage.setItem(
                "workforceLoggedInUser",
                JSON.stringify(loggedInUser)
            );

            localStorage.setItem(
                "workforceRegisteredUser",
                JSON.stringify(loggedInUser)
            );

            /*
             * If the backend already has the user's
             * profile, restore it locally.
             */

            if (
                data.education ||
                data.year ||
                data.career ||
                data.goal ||
                data.studyHours ||
                data.studyDays
            ) {

                const profile = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    education: data.education || "",
                    year: data.year || "",
                    career: data.career || "",
                    goal: data.goal || "",
                    studyHours: data.studyHours || "",
                    studyDays: data.studyDays || ""
                };

                localStorage.setItem(
                    "workforceProfile",
                    JSON.stringify(profile)
                );
                localStorage.setItem(
                    "workforceProfileCachedAt",
                    String(Date.now())
                );
            }

            /*
             * Remember-me preference
             */

            if (rememberMe) {

                localStorage.setItem(
                    "workforceRememberMe",
                    rememberMe.checked
                        ? "true"
                        : "false"
                );
            }

            /*
             * Decide where the user should go.
             */

            const savedProfile =
                JSON.parse(
                    localStorage.getItem("workforceProfile")
                ) || {};

            if (
                savedProfile.career &&
                savedProfile.goal
            ) {

                window.location.href =
                    "dashboard.html";

            } else {

                window.location.href =
                    "profile.html";
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Cannot connect to WorkforceIQ server. " +
                "Please make sure the backend is running."
            );

        } finally {
            clearTimeout(warmUpTimer);

            if (loginButton) {

                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
});