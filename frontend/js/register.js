document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms = document.getElementById("terms");

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (terms && !terms.checked) {
            alert("Please accept the Terms and Conditions.");
            return;
        }

        const registerButton =
            registerForm.querySelector("button[type='submit']");

        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Creating Account...";
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {

                let message = "Registration failed.";

                if (typeof data === "string") {
                    message = data;
                } else if (data && data.message) {
                    message = data.message;
                }

                alert(message);
                return;
            }

            /*
             * Keep a small amount of login information locally
             * so the existing WorkforceIQ frontend can continue
             * working while we connect the remaining pages.
             */
            localStorage.setItem(
                "workforceRegisteredUser",
                JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            );

            localStorage.setItem(
                "workforceLoggedInUser",
                JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            );

            alert("Account created successfully!");

            window.location.href = "profile.html";

        } catch (error) {

            console.error("Registration error:", error);

            alert(
                "Cannot connect to WorkforceIQ server. " +
                "Please make sure the backend is running."
            );

        } finally {

            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = "Create Account";
            }
        }
    });
});