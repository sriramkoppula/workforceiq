document.addEventListener("DOMContentLoaded", async function () {

    "use strict";


    /* ==========================================
       USER
    ========================================== */

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("workforceLoggedInUser")
        ) || null;

    if (!loggedInUser || !loggedInUser.id) {
        window.location.href = "login.html";
        return;
    }

    const userId = Number(loggedInUser.id);


    /* ==========================================
       PROFILE
    ========================================== */

    const profile =
        JSON.parse(
            localStorage.getItem("workforceProfile")
        ) || {};

    const career =
        profile.career || "";


    /* ==========================================
       AVAILABLE SKILLS
    ========================================== */

    const availableSkills = {

        "Java Backend Developer": [
            "Java Fundamentals",
            "OOP",
            "Data Structures",
            "SQL",
            "REST API",
            "Spring Boot",
            "Git"
        ],

        "Frontend Developer": [
            "HTML",
            "CSS",
            "JavaScript",
            "Git",
            "React",
            "REST API"
        ],

        "Data Analyst": [
            "Python",
            "SQL",
            "Statistics",
            "Excel",
            "Data Visualization",
            "Power BI"
        ],

        "Cloud Engineer": [
            "Linux",
            "Networking",
            "Git",
            "AWS",
            "Docker",
            "Kubernetes"
        ]
    };


    /* ==========================================
       ELEMENTS
    ========================================== */

    const skillSelect =
        document.getElementById("skillSelect");

    /*
     * Try the expected ID first.
     * If it doesn't exist, automatically find
     * the range slider.
     */

    const confidenceInput =
        document.getElementById("confidence") ||
        document.querySelector(
            'input[type="range"]'
        );

    const confidenceValue =
        document.getElementById(
            "confidenceValue"
        );

    const skillsList =
        document.getElementById(
            "skillsList"
        );

    const careerDisplay =
        document.getElementById(
            "targetCareer"
        );


    /* ==========================================
       FIND ADD SKILL BUTTON
    ========================================== */

    let addSkillButton =
        document.getElementById(
            "addSkillButton"
        );

    if (!addSkillButton) {

        document
            .querySelectorAll("button")
            .forEach(function (button) {

                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();

                if (
                    text.includes("add skill")
                ) {

                    addSkillButton =
                        button;
                }
            });
    }


    /* ==========================================
       SKILLS
    ========================================== */

    let skills = [];


    /* ==========================================
       CAREER DISPLAY
    ========================================== */

    if (careerDisplay) {

        careerDisplay.textContent =
            career || "Not selected";
    }


    /* ==========================================
       LOAD SKILL OPTIONS
    ========================================== */

    function loadSkillOptions() {

        if (!skillSelect) {

            console.error(
                "skillSelect not found."
            );

            return;
        }

        skillSelect.innerHTML = `
            <option value="">
                Select a skill
            </option>
        `;

        const careerSkills =
            availableSkills[career] || [];

        careerSkills.forEach(
            function (skill) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = skill;
                option.textContent = skill;

                skillSelect.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================
       CONFIDENCE DISPLAY
    ========================================== */

    function updateConfidenceValue() {

        if (
            confidenceInput &&
            confidenceValue
        ) {

            confidenceValue.textContent =
                confidenceInput.value + "%";
        }
    }


    /* ==========================================
       CONFIDENCE SLIDER
    ========================================== */

    if (confidenceInput) {

        confidenceInput.addEventListener(
            "input",
            updateConfidenceValue
        );

        updateConfidenceValue();

    } else {

        console.error(
            "Confidence range slider not found."
        );
    }


    /* ==========================================
       LOAD SKILLS FROM MYSQL
    ========================================== */

    async function loadSkillsFromBackend() {

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/user-skills/user/${userId}`
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load skills."
                );
            }

            const data =
                await response.json();


            skills =
                data.map(
                    function (skill) {

                        return {

                            id:
                                skill.id,

                            name:
                                skill.skillName,

                            confidence:
                                Number(
                                    skill.confidence
                                )
                        };
                    }
                );


            /* ==============================
               LOCAL STORAGE
            ============================== */

            localStorage.setItem(
                "workforceSkills",
                JSON.stringify(skills)
            );


            renderSkills();


        } catch (error) {

            console.error(
                "Loading skills error:",
                error
            );


            /*
             * Use localStorage only if
             * backend cannot be reached.
             */

            skills =
                JSON.parse(
                    localStorage.getItem(
                        "workforceSkills"
                    )
                ) || [];


            renderSkills();
        }
    }


    /* ==========================================
       SKILL STATUS
    ========================================== */

    function getStatus(confidence) {

        if (confidence >= 80) {

            return "STRONG";
        }

        if (confidence >= 50) {

            return "DEVELOPING";
        }

        return "BASIC";
    }


    /* ==========================================
       CREATE NEW SKILL
    ========================================== */

    async function createSkill(
        skillName,
        confidence
    ) {

        const response =
            await fetch(
                "http://localhost:8080/api/user-skills",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            userId,

                        skillName:
                            skillName,

                        confidence:
                            confidence
                    })
                }
            );


        const data =
            await response.json().catch(
                function () {
                    return null;
                }
            );


        if (!response.ok) {

            throw new Error(
                typeof data === "string"
                    ? data
                    : "Unable to add skill."
            );
        }


        return data;
    }


    /* ==========================================
       UPDATE EXISTING SKILL
    ========================================== */

    async function updateSkill(
        skillId,
        confidence
    ) {

        const response =
            await fetch(
                `http://localhost:8080/api/user-skills/${skillId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        confidence:
                            confidence
                    })
                }
            );


        const data =
            await response.json().catch(
                function () {
                    return null;
                }
            );


        if (!response.ok) {

            throw new Error(
                typeof data === "string"
                    ? data
                    : "Unable to update skill."
            );
        }


        return data;
    }


    /* ==========================================
       SKILL SELECTION
    ========================================== */

    if (skillSelect) {

        skillSelect.addEventListener(
            "change",
            function () {

                const selectedSkill =
                    skillSelect.value;


                const existingSkill =
                    skills.find(
                        function (skill) {

                            return (
                                skill.name ===
                                selectedSkill
                            );
                        }
                    );


                if (existingSkill) {

                    /*
                     * Load current confidence
                     */

                    if (confidenceInput) {

                        confidenceInput.value =
                            existingSkill.confidence;
                    }


                    updateConfidenceValue();


                    if (addSkillButton) {

                        addSkillButton.textContent =
                            "Update Skill";
                    }

                } else {

                    /*
                     * New skill starts at 50%
                     */

                    if (confidenceInput) {

                        confidenceInput.value =
                            50;
                    }


                    updateConfidenceValue();


                    if (addSkillButton) {

                        addSkillButton.textContent =
                            "+ Add Skill";
                    }
                }
            }
        );
    }


    /* ==========================================
       ADD / UPDATE SKILL
    ========================================== */

    async function addSkill(event) {

        if (event) {

            event.preventDefault();
            event.stopPropagation();
        }


        const skillName =
            skillSelect
                ? skillSelect.value
                : "";


        const confidence =
            confidenceInput
                ? Number(
                    confidenceInput.value
                )
                : 50;


        /* ======================================
           VALIDATION
        ====================================== */

        if (!skillName) {

            alert(
                "Please select a skill."
            );

            return;
        }


        if (
            confidence < 0 ||
            confidence > 100
        ) {

            alert(
                "Confidence must be between 0 and 100."
            );

            return;
        }


        /* ======================================
           FIND EXISTING SKILL
        ====================================== */

        const existingSkill =
            skills.find(
                function (skill) {

                    return (
                        skill.name ===
                        skillName
                    );
                }
            );


        try {

            if (addSkillButton) {

                addSkillButton.disabled =
                    true;

                addSkillButton.textContent =
                    "Saving...";
            }


            let savedSkill;


            /* ==================================
               NEW SKILL
            ================================== */

            if (!existingSkill) {

                savedSkill =
                    await createSkill(
                        skillName,
                        confidence
                    );


                skills.push({

                    id:
                        savedSkill.id,

                    name:
                        savedSkill.skillName,

                    confidence:
                        Number(
                            savedSkill.confidence
                        )
                });


            }

            /* ==================================
               UPDATE EXISTING SKILL
            ================================== */

            else {

                savedSkill =
                    await updateSkill(
                        existingSkill.id,
                        confidence
                    );


                existingSkill.confidence =
                    Number(
                        savedSkill.confidence
                    );
            }


            /* ==================================
               SAVE LOCAL STORAGE
            ================================== */

            localStorage.setItem(
                "workforceSkills",
                JSON.stringify(skills)
            );


            /* ==================================
               UPDATE DISPLAY
            ================================== */

            renderSkills();


            /*
             * Keep the selected skill.
             */

            if (skillSelect) {

                skillSelect.value =
                    skillName;
            }


            /*
             * IMPORTANT:
             * Only reset the slider if it exists.
             */

            if (confidenceInput) {

                confidenceInput.value =
                    confidence;
            }


            updateConfidenceValue();


            if (addSkillButton) {

                addSkillButton.textContent =
                    "Update Skill";
            }


        } catch (error) {

            console.error(
                "Skill save/update error:",
                error
            );

            alert(
                error.message ||
                "Unable to save skill."
            );


        } finally {

            if (addSkillButton) {

                addSkillButton.disabled =
                    false;
            }
        }
    }


    /* ==========================================
       GLOBAL FUNCTION
    ========================================== */

    window.addSkill =
        addSkill;


    /* ==========================================
       CONNECT BUTTON
    ========================================== */

    if (addSkillButton) {

        /*
         * Prevent duplicate click
         */

        addSkillButton.removeAttribute(
            "onclick"
        );


        addSkillButton.addEventListener(
            "click",
            addSkill
        );
    }


    /* ==========================================
       DELETE SKILL
    ========================================== */

    async function deleteSkill(
        skillName
    ) {

        const confirmed =
            confirm(
                `Remove ${skillName} from your skills?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/user-skills/user/${userId}/skill/${encodeURIComponent(skillName)}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to delete skill."
                );
            }


            skills =
                skills.filter(
                    function (skill) {

                        return (
                            skill.name !==
                            skillName
                        );
                    }
                );


            localStorage.setItem(
                "workforceSkills",
                JSON.stringify(skills)
            );


            renderSkills();


            /*
             * Reset form safely
             */

            if (skillSelect) {

                skillSelect.value = "";
            }


            if (confidenceInput) {

                confidenceInput.value =
                    50;
            }


            updateConfidenceValue();


            if (addSkillButton) {

                addSkillButton.textContent =
                    "+ Add Skill";
            }


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                error.message ||
                "Unable to delete skill."
            );
        }
    }


    /* ==========================================
       RENDER SKILLS
    ========================================== */

    function renderSkills() {

        if (!skillsList) {

            console.error(
                "skillsList not found."
            );

            return;
        }


        skillsList.innerHTML = "";


        /* ======================================
           EMPTY
        ====================================== */

        if (skills.length === 0) {

            skillsList.innerHTML = `

                <div class="empty-state">

                    <p>
                        No skills added yet.
                    </p>

                    <span>
                        Add your first skill above.
                    </span>

                </div>

            `;

        }


        /* ======================================
           SKILLS
        ====================================== */

        else {

            skills.forEach(
                function (skill) {

                    const confidence =
                        Number(
                            skill.confidence
                        ) || 0;


                    const status =
                        getStatus(
                            confidence
                        );


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "skill-card";


                    card.innerHTML = `

                        <div class="skill-card-main">

                            <div>

                                <h3>
                                    ${escapeHTML(
                                        skill.name
                                    )}
                                </h3>

                                <span
                                    class="skill-status ${status.toLowerCase()}">

                                    ${status}

                                </span>

                            </div>


                            <div class="skill-confidence">

                                <strong>
                                    ${confidence}%
                                </strong>

                                <span>
                                    Confidence
                                </span>

                            </div>

                        </div>


                        <div class="skill-progress">

                            <div
                                class="skill-progress-bar"
                                style="width:${confidence}%">
                            </div>

                        </div>


                        <button
                            type="button"
                            class="delete-skill-button">

                            Remove

                        </button>

                    `;


                    const deleteButton =
                        card.querySelector(
                            ".delete-skill-button"
                        );


                    if (deleteButton) {

                        deleteButton.addEventListener(
                            "click",
                            function () {

                                deleteSkill(
                                    skill.name
                                );
                            }
                        );
                    }


                    skillsList.appendChild(
                        card
                    );
                }
            );
        }


        /* ======================================
           SKILL COUNT
        ====================================== */

        let countElement =
            document.getElementById(
                "skillsCount"
            );


        if (!countElement) {

            countElement =
                document.getElementById(
                    "skillCount"
                );
        }


        if (!countElement) {

            countElement =
                document.getElementById(
                    "skillsCountDisplay"
                );
        }


        if (!countElement) {

            document
                .querySelectorAll(
                    "span, p, div, strong"
                )
                .forEach(
                    function (element) {

                        if (countElement) {
                            return;
                        }


                        const text =
                            element.textContent
                                .trim();


                        if (
                            /^\d+\s+Skills?$/i
                                .test(text)
                        ) {

                            countElement =
                                element;
                        }
                    }
                );
        }


        if (countElement) {

            countElement.textContent =
                skills.length +
                (
                    skills.length === 1
                        ? " Skill"
                        : " Skills"
                );
        }
    }


    /* ==========================================
       ESCAPE HTML
    ========================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* ==========================================
       CONTINUE TO EVIDENCE
    ========================================== */

    const continueButton =
        document.getElementById(
            "continueButton"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                window.location.href =
                    "evidence.html";
            }
        );
    }


    /* ==========================================
       INITIALIZE
    ========================================== */

    loadSkillOptions();

    await loadSkillsFromBackend();

});
// =====================================================
// CONTINUE TO EVIDENCE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll("button");

    buttons.forEach(function (button) {

        const text = button.textContent
            .trim()
            .toLowerCase();

        if (text.includes("continue to evidence")) {

            // Remove any old inline handler
            button.removeAttribute("onclick");

            // Make sure the button works
            button.addEventListener("click", function () {

                console.log(
                    "Continue to Evidence clicked"
                );

                window.location.href = "evidence.html";

            });

            console.log(
                "Continue to Evidence button connected."
            );
        }
    });

});