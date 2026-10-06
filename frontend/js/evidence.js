// ============================================
// WORKFORCEIQ - EVIDENCE
// BACKEND CONNECTED
// ============================================

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let userSkills = [];
let allEvidence = [];


// ============================================
// GET CURRENT USER
// ============================================

function getCurrentUser() {

    const loggedIn =
        JSON.parse(
            localStorage.getItem("workforceLoggedInUser")
        );

    const registered =
        JSON.parse(
            localStorage.getItem("workforceRegisteredUser")
        );

    return loggedIn || registered || null;
}


// ============================================
// LOAD USER SKILLS
// ============================================

async function loadSkills() {

    const skillSelect =
        document.getElementById("skillSelect");

    if (!skillSelect || !currentUser) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/user-skills/user/${currentUser.id}`
        );

        if (!response.ok) {
            throw new Error("Unable to load skills");
        }

        userSkills = await response.json();

        skillSelect.innerHTML =
            `<option value="">Select skill</option>`;

        userSkills.forEach(skill => {

            const option =
                document.createElement("option");

            option.value = skill.skillName;
            option.textContent = skill.skillName;

            skillSelect.appendChild(option);

        });

        // Support ?skill=OOP
        const params =
            new URLSearchParams(window.location.search);

        const requestedSkill =
            params.get("skill");

        if (requestedSkill) {

            const exists =
                userSkills.some(
                    skill =>
                        skill.skillName === requestedSkill
                );

            if (exists) {
                skillSelect.value = requestedSkill;
            }
        }

    } catch (error) {

        console.error(
            "Error loading skills:",
            error
        );

        skillSelect.innerHTML =
            `<option value="">Unable to load skills</option>`;
    }
}


// ============================================
// LOAD EVIDENCE
// ============================================

async function loadEvidence() {

    if (!currentUser) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/evidence/user/${currentUser.id}`
        );

        if (!response.ok) {
            throw new Error("Unable to load evidence");
        }

        allEvidence =
            await response.json();

        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(allEvidence)
        );

        renderEvidence();
        calculateReadiness();

    } catch (error) {

        console.error(
            "Error loading evidence:",
            error
        );

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "workforceEvidence"
                )
            ) || [];

        allEvidence = saved;

        renderEvidence();
        calculateReadiness();
    }
}


// ============================================
// ADD EVIDENCE
// ============================================

async function addEvidence() {

    const skillSelect =
        document.getElementById("skillSelect");

    const evidenceType =
        document.getElementById("evidenceType");

    const evidenceScore =
        document.getElementById("evidenceScore");

    const description =
        document.getElementById("evidenceDescription");


    const skillName =
        skillSelect.value.trim();

    const type =
        evidenceType.value.trim();

    const score =
        Number(evidenceScore.value);

    const descriptionText =
        description.value.trim();


    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!skillName) {

        alert("Please select a skill.");
        return;
    }

    if (!type) {

        alert("Please select evidence type.");
        return;
    }

    if (
        Number.isNaN(score) ||
        score < 0 ||
        score > 100
    ) {

        alert(
            "Please enter an evidence score between 0 and 100."
        );

        return;
    }


    if (!currentUser) {

        alert(
            "User session not found. Please login again."
        );

        return;
    }


    // -----------------------------
    // PREPARE DATA
    // -----------------------------

    const evidenceData = {

        userId: Number(currentUser.id),

        skillName: skillName,

        evidenceType: type,

        score: score,

        description:
            descriptionText

    };


    console.log(
        "Sending evidence:",
        evidenceData
    );


    try {

        const response = await fetch(
            `${API_URL}/evidence`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        evidenceData
                    )
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Backend error:",
                errorText
            );

            throw new Error(
                errorText ||
                "Failed to save evidence"
            );
        }


        const savedEvidence =
            await response.json();


        console.log(
            "Evidence saved:",
            savedEvidence
        );


        // Add to current list
        allEvidence.unshift(
            savedEvidence
        );


        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(allEvidence)
        );


        // Clear form
        evidenceScore.value = "";
        description.value = "";


        renderEvidence();

        calculateReadiness();


        alert(
            "Evidence added successfully!"
        );


    } catch (error) {

        console.error(
            "Add evidence error:",
            error
        );

        alert(
            "Unable to save evidence.\n\n" +
            error.message
        );
    }
}


// ============================================
// RENDER EVIDENCE
// ============================================

function renderEvidence() {

    const container =
        document.getElementById(
            "evidenceList"
        );

    const countElement =
        document.getElementById(
            "evidenceCount"
        );


    if (!container) {
        return;
    }


    if (countElement) {

        countElement.textContent =
            `${allEvidence.length} Evidence`;
    }


    if (allEvidence.length === 0) {

        container.innerHTML = `

            <div class="empty-evidence">

                <div>🔎</div>

                <h3>
                    No evidence added yet
                </h3>

                <p>
                    Add evidence to calculate your
                    skill confidence.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    allEvidence.forEach(
        evidence => {

            const item =
                document.createElement("div");

            item.className =
                "evidence-item";


            const date =
                evidence.createdAt
                    ? new Date(
                        evidence.createdAt
                    ).toLocaleDateString()
                    : new Date()
                        .toLocaleDateString();


            item.innerHTML = `

                <div>

                    <h3>
                        ${escapeHTML(
                            evidence.skillName
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            evidence.evidenceType
                        )}
                        · Score:
                        <strong>
                            ${evidence.score}%
                        </strong>
                    </p>

                    ${
                        evidence.description
                            ? `
                                <p>
                                    ${escapeHTML(
                                        evidence.description
                                    )}
                                </p>
                              `
                            : ""
                    }

                    <small>
                        ${date}
                    </small>

                </div>

                <button
                    type="button"
                    class="delete-evidence"
                    data-id="${evidence.id}"
                >
                    Delete
                </button>

            `;


            const deleteButton =
                item.querySelector(
                    ".delete-evidence"
                );


            deleteButton.addEventListener(
                "click",
                () =>
                    deleteEvidence(
                        evidence.id
                    )
            );


            container.appendChild(item);

        }
    );
}


// ============================================
// DELETE EVIDENCE
// ============================================

async function deleteEvidence(id) {

    if (
        !confirm(
            "Delete this evidence?"
        )
    ) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/evidence/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to delete evidence"
            );
        }


        allEvidence =
            allEvidence.filter(
                evidence =>
                    evidence.id !== id
            );


        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(allEvidence)
        );


        renderEvidence();

        calculateReadiness();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Unable to delete evidence."
        );
    }
}


// ============================================
// CALCULATE SKILL CONFIDENCE
// ============================================

function calculateSkillConfidence(
    skillName
) {

    const evidence =
        allEvidence.filter(
            item =>
                item.skillName === skillName
        );


    if (evidence.length === 0) {
        return 0;
    }


    const weights = {

        assessment: 0.35,

        project: 0.30,

        problems: 0.20,

        practice: 0.15

    };


    let totalWeight = 0;
    let weightedScore = 0;


    evidence.forEach(
        item => {

            const weight =
                weights[
                    item.evidenceType
                ] || 0;


            if (weight > 0) {

                weightedScore +=
                    item.score * weight;

                totalWeight += weight;
            }

        }
    );


    if (totalWeight === 0) {

        return 0;
    }


    return Math.round(
        weightedScore /
        totalWeight
    );
}


// ============================================
// UPDATE USER SKILL CONFIDENCE
// ============================================

async function updateSkillConfidence(
    skillName,
    confidence
) {

    const skill =
        userSkills.find(
            item =>
                item.skillName === skillName
        );


    if (!skill) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/user-skills/${skill.id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        confidence:
                            confidence
                    })
            }
        );


        if (!response.ok) {

            console.warn(
                "Could not update skill confidence"
            );

            return;
        }


        const updatedSkill =
            await response.json();


        const index =
            userSkills.findIndex(
                item =>
                    item.id === updatedSkill.id
            );


        if (index !== -1) {

            userSkills[index] =
                updatedSkill;
        }


    } catch (error) {

        console.error(
            "Skill update error:",
            error
        );
    }
}


// ============================================
// READINESS
// ============================================

async function calculateReadiness() {

    const scoreElement =
        document.getElementById(
            "overallScore"
        );

    const messageElement =
        document.getElementById(
            "scoreMessage"
        );


    if (
        !scoreElement ||
        !messageElement
    ) {
        return;
    }


    if (
        userSkills.length === 0
    ) {

        scoreElement.textContent =
            "0%";

        messageElement.textContent =
            "Add skills and evidence to measure your readiness.";

        return;
    }


    let total =
        0;


    for (
        const skill of userSkills
    ) {

        const confidence =
            calculateSkillConfidence(
                skill.skillName
            );


        if (
            confidence > 0
        ) {

            total += confidence;

            await updateSkillConfidence(
                skill.skillName,
                confidence
            );

        } else {

            total +=
                Number(
                    skill.confidence || 0
                );

        }

    }


    const readiness =
        Math.round(
            total /
            userSkills.length
        );


    scoreElement.textContent =
        `${readiness}%`;


    if (readiness >= 80) {

        messageElement.textContent =
            "Excellent readiness. Keep practicing and maintaining your skills.";

    } else if (readiness >= 50) {

        messageElement.textContent =
            "Good progress. Continue improving your developing skills.";

    } else {

        messageElement.textContent =
            "Keep learning and add more evidence to improve your readiness.";

    }


    // Save current readiness
    localStorage.setItem(
        "workforceReadiness",
        readiness
    );
}


// ============================================
// SAFE HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// ============================================
// VIEW READINESS
// ============================================

function setupReadinessButton() {

    const button =
        document.getElementById(
            "viewReadinessButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );
}


// ============================================
// INITIALIZE
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "WorkforceIQ Evidence loaded"
        );


        currentUser =
            getCurrentUser();


        console.log(
            "Current user:",
            currentUser
        );


        if (!currentUser) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;
        }


        // IMPORTANT:
        // Connect button here
        const addButton =
            document.getElementById(
                "addEvidenceButton"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                addEvidence
            );

            console.log(
                "Add Evidence button connected"
            );

        } else {

            console.error(
                "Add Evidence button NOT found"
            );
        }


        setupReadinessButton();


        await loadSkills();

        await loadEvidence();

    }
);


// Make function available in console if needed
window.addEvidence =
    addEvidence;

window.deleteEvidence =
    deleteEvidence;