document.addEventListener("DOMContentLoaded", function () {


    const emailForm =
        document.getElementById("emailForm");


    const passwordForm =
        document.getElementById("passwordForm");


    const emailStep =
        document.getElementById("emailStep");


    const passwordStep =
        document.getElementById("passwordStep");


    const resetMessage =
        document.getElementById("resetMessage");


    let resetEmail = "";



    /* =========================
       EMAIL STEP
    ========================== */

    emailForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            const registeredUser =
                JSON.parse(
                    localStorage.getItem(
                        "workforceRegisteredUser"
                    )
                );


            if (!registeredUser) {

                showMessage(
                    "No WorkforceIQ account was found. Please register first.",
                    "error"
                );

                return;
            }


            if (registeredUser.email !== email) {

                showMessage(
                    "No account was found with this email address.",
                    "error"
                );

                return;
            }


            resetEmail = email;


            emailStep.classList.add("hidden");

            passwordStep.classList.remove("hidden");


            showMessage(
                "Email verified. Create your new password.",
                "success"
            );

        }
    );



    /* =========================
       PASSWORD STEP
    ========================== */

    passwordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newPassword =
                document.getElementById("newPassword")
                    .value;


            const confirmPassword =
                document.getElementById("confirmPassword")
                    .value;


            if (newPassword.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (newPassword !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            const registeredUser =
                JSON.parse(
                    localStorage.getItem(
                        "workforceRegisteredUser"
                    )
                );


            if (
                !registeredUser ||
                registeredUser.email !== resetEmail
            ) {

                showMessage(
                    "Unable to reset password. Please try again.",
                    "error"
                );

                return;
            }


            /* Update password */

            registeredUser.password =
                newPassword;


            registeredUser.passwordUpdatedAt =
                new Date().toISOString();


            localStorage.setItem(
                "workforceRegisteredUser",
                JSON.stringify(registeredUser)
            );


            /* Clear old session */

            localStorage.removeItem(
                "workforceLoggedInUser"
            );


            showMessage(
                "Password reset successfully! Redirecting to login...",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1200);

        }
    );



    /* =========================
       EMAIL VALIDATION
    ========================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }



    /* =========================
       MESSAGE
    ========================== */

    function showMessage(
        message,
        type
    ) {

        resetMessage.textContent =
            message;


        if (type === "success") {

            resetMessage.style.color =
                "#16a34a";

        } else {

            resetMessage.style.color =
                "#dc2626";
        }
    }

});