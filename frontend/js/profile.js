// =====================================================
// WORKFORCEIQ - PROFILE
// Backend Connected Version
// =====================================================

const API_URL = window.API_URL || "http://localhost:8080/api";


// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "workforceLoggedInUser"
            )
        );

    } catch {

        return null;
    }
}


const loggedInUser =
    getLoggedInUser();


// =====================================================
// AUTH CHECK
// =====================================================

if (!loggedInUser || !loggedInUser.id) {

    window.location.href =
        "login.html";
}


// =====================================================
// HELPERS
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
}


function showError(message) {

    let errorBox =
        document.getElementById(
            "profileError"
        );


    if (!errorBox) {

        errorBox =
            document.createElement("div");

        errorBox.id =
            "profileError";

        errorBox.style.marginTop =
            "15px";

        errorBox.style.padding =
            "12px";

        errorBox.style.borderRadius =
            "8px";

        errorBox.style.background =
            "#ffe8e8";

        errorBox.style.color =
            "#b00020";

        const form =
            document.querySelector("form");

        if (form) {
            form.prepend(errorBox);
        }
    }


    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";
}


function hideError() {

    const errorBox =
        document.getElementById(
            "profileError"
        );

    if (errorBox) {

        errorBox.style.display =
            "none";
    }
}


// =====================================================
// LOAD EXISTING PROFILE
// =====================================================

async function loadProfile() {

    if (!loggedInUser || !loggedInUser.id) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/${loggedInUser.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Profile could not be loaded"
            );
        }


        const user =
            await response.json();


        // ---------------------------------------------
        // BASIC INFORMATION
        // ---------------------------------------------

        const name =
            document.getElementById("name");

        if (name && user.name) {
            name.value =
                user.name;
        }


        const email =
            document.getElementById("email");

        if (email && user.email) {
            email.value =
                user.email;
        }


        const education =
            document.getElementById("education");

        if (education && user.education) {
            education.value =
                user.education;
        }


        const year =
            document.getElementById("year");

        if (year && user.year) {
            year.value =
                user.year;
        }


        // ---------------------------------------------
        // CAREER RADIO
        // ---------------------------------------------

        if (user.career) {

            const career =
                document.querySelector(
                    `input[name="career"][value="${CSS.escape(user.career)}"]`
                );

            if (career) {
                career.checked =
                    true;
            }
        }


        // ---------------------------------------------
        // CAREER GOAL
        // ---------------------------------------------

        const goal =
            document.getElementById("goal");

        if (goal && user.goal) {

            goal.value =
                user.goal;
        }


        // ---------------------------------------------
        // STUDY HOURS
        // ---------------------------------------------

        const studyHours =
            document.getElementById(
                "studyHours"
            );

        if (
            studyHours &&
            user.studyHours !== null &&
            user.studyHours !== undefined
        ) {

            studyHours.value =
                String(user.studyHours);
        }


        // ---------------------------------------------
        // STUDY DAYS
        // ---------------------------------------------

        const studyDays =
            document.getElementById(
                "studyDays"
            );

        if (
            studyDays &&
            user.studyDays !== null &&
            user.studyDays !== undefined
        ) {

            studyDays.value =
                String(user.studyDays);
        }


        // Keep localStorage synchronized
        localStorage.setItem(
            "workforceProfile",
            JSON.stringify(user)
        );


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        // Fall back to existing localStorage
        loadLocalProfile();
    }
}


// =====================================================
// LOCAL STORAGE FALLBACK
// =====================================================

function loadLocalProfile() {

    try {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    "workforceProfile"
                )
            );


        if (!profile) {
            return;
        }


        const name =
            document.getElementById("name");

        if (name && profile.name) {
            name.value =
                profile.name;
        }


        const email =
            document.getElementById("email");

        if (email && profile.email) {
            email.value =
                profile.email;
        }


        const education =
            document.getElementById("education");

        if (
            education &&
            profile.education
        ) {
            education.value =
                profile.education;
        }


        const year =
            document.getElementById("year");

        if (year && profile.year) {
            year.value =
                profile.year;
        }


        if (profile.career) {

            const career =
                document.querySelector(
                    `input[name="career"][value="${CSS.escape(profile.career)}"]`
                );

            if (career) {
                career.checked =
                    true;
            }
        }


        const goal =
            document.getElementById("goal");

        if (goal && profile.goal) {
            goal.value =
                profile.goal;
        }


        const studyHours =
            document.getElementById(
                "studyHours"
            );

        if (
            studyHours &&
            profile.studyHours
        ) {
            studyHours.value =
                String(profile.studyHours);
        }


        const studyDays =
            document.getElementById(
                "studyDays"
            );

        if (
            studyDays &&
            profile.studyDays
        ) {
            studyDays.value =
                String(profile.studyDays);
        }

    } catch (error) {

        console.error(
            "Local profile error:",
            error
        );
    }
}


// =====================================================
// SAVE PROFILE TO BACKEND
// =====================================================

async function saveProfile(event) {

    if (event) {
        event.preventDefault();
    }


    hideError();


    // ---------------------------------------------
    // READ VALUES
    // ---------------------------------------------

    const name =
        getValue("name");

    const email =
        getValue("email");

    const education =
        getValue("education");

    const year =
        getValue("year");


    const careerInput =
        document.querySelector(
            'input[name="career"]:checked'
        );

    const career =
        careerInput
            ? careerInput.value
            : "";


    const goal =
        getValue("goal");


    const studyHours =
        getValue("studyHours");

    const studyDays =
        getValue("studyDays");


    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!name) {

        showError(
            "Please enter your name."
        );

        return;
    }


    if (!email) {

        showError(
            "Please enter your email."
        );

        return;
    }


    if (!education) {

        showError(
            "Please enter your education."
        );

        return;
    }


    if (!year) {

        showError(
            "Please select your current year."
        );

        return;
    }


    if (!career) {

        showError(
            "Please select your target career."
        );

        return;
    }


    if (!goal) {

        showError(
            "Please select your career goal."
        );

        return;
    }


    if (!studyHours) {

        showError(
            "Please select how many hours you can study per day."
        );

        return;
    }


    if (!studyDays) {

        showError(
            "Please select how many days you can study per week."
        );

        return;
    }


    // ---------------------------------------------
    // PROFILE OBJECT
    // ---------------------------------------------

    const profileData = {

        name: name,

        email: email,

        education: education,

        year: year,

        career: career,

        goal: goal,

        studyHours:
            Number(studyHours),

        studyDays:
            Number(studyDays)
    };


    // ---------------------------------------------
    // SAVE TO BACKEND
    // ---------------------------------------------

    try {

        const response =
            await fetch(
                `${API_URL}/users/${loggedInUser.id}/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            profileData
                        )
                }
            );


        if (!response.ok) {

            let message =
                "Unable to save profile.";

            try {

                const error =
                    await response.text();

                if (error) {
                    message =
                        error;
                }

            } catch {
                // Keep default message
            }


            throw new Error(message);
        }


        const savedUser =
            await response.json();


        // ---------------------------------------------
        // UPDATE LOCAL USER
        // ---------------------------------------------

        localStorage.setItem(
            "workforceLoggedInUser",
            JSON.stringify({
                id:
                    savedUser.id ||
                    loggedInUser.id,

                name:
                    savedUser.name ||
                    name,

                email:
                    savedUser.email ||
                    email
            })
        );


        // ---------------------------------------------
        // SAVE FULL PROFILE LOCALLY
        // ---------------------------------------------

        localStorage.setItem(
            "workforceProfile",
            JSON.stringify(
                savedUser
            )
        );


        // ---------------------------------------------
        // INITIALIZE LOCAL DATA
        // ---------------------------------------------

        if (
            !localStorage.getItem(
                "workforceSkills"
            )
        ) {

            localStorage.setItem(
                "workforceSkills",
                JSON.stringify([])
            );
        }


        if (
            !localStorage.getItem(
                "workforceEvidence"
            )
        ) {

            localStorage.setItem(
                "workforceEvidence",
                JSON.stringify([])
            );
        }


        // ---------------------------------------------
        // CONTINUE
        // ---------------------------------------------

        window.location.href =
            "skills.html";


    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );


        showError(
            error.message ||
            "Unable to save profile. Make sure the backend is running."
        );
    }
}


// =====================================================
// EVENT HANDLERS
// =====================================================

function setupProfileForm() {

    const form =
        document.querySelector("form");


    if (form) {

        form.addEventListener(
            "submit",
            saveProfile
        );
    }


    // Find Continue button safely
    const buttons =
        document.querySelectorAll(
            "button, input[type='submit']"
        );


    buttons.forEach(
        button => {

            const text =
                (
                    button.textContent ||
                    button.value ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            if (
                text.includes("continue") &&
                text.includes("skill")
            ) {

                button.addEventListener(
                    "click",
                    function(event) {

                        if (
                            form &&
                            !event.defaultPrevented
                        ) {

                            saveProfile(event);
                        }

                    }
                );
            }
        }
    );
}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        await loadProfile();

        setupProfileForm();
    }
);