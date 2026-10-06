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

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/login",
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

            if (loginButton) {

                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
});