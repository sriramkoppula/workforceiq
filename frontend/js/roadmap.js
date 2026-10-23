// =====================================================
// WORKFORCEIQ - ROADMAP
// BACKEND CONNECTED
// =====================================================

const API_URL = window.API_URL || "http://localhost:8080/api";

let currentUser = null;
let profile = {};
let userSkills = [];


// =====================================================
// CAREER SKILLS
// =====================================================

const careerSkills = {

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


// =====================================================
// PREREQUISITES
// =====================================================

const prerequisites = {

    "Java Fundamentals": [],

    "OOP": [
        "Java Fundamentals"
    ],

    "Data Structures": [
        "Java Fundamentals",
        "OOP"
    ],

    "SQL": [],

    "REST API": [
        "Java Fundamentals",
        "OOP"
    ],

    "Spring Boot": [
        "Java Fundamentals",
        "OOP",
        "REST API"
    ],

    "Git": [],

    "HTML": [],

    "CSS": [
        "HTML"
    ],

    "JavaScript": [
        "HTML",
        "CSS"
    ],

    "React": [
        "JavaScript"
    ],

    "REST API": [
        "JavaScript"
    ],

    "Python": [],

    "Statistics": [],

    "Excel": [],

    "Data Visualization": [
        "Python",
        "Statistics"
    ],

    "Power BI": [
        "Excel",
        "Data Visualization"
    ],

    "Linux": [],

    "Networking": [
        "Linux"
    ],

    "AWS": [
        "Linux",
        "Networking"
    ],

    "Docker": [
        "Linux"
    ],

    "Kubernetes": [
        "Docker",
        "Networking"
    ]

};


// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getLoggedInUser() {

    const storedUser =
        localStorage.getItem(
            "workforceLoggedInUser"
        );

    if (!storedUser) {

        window.location.href =
            "login.html";

        return null;
    }

    try {

        const user =
            JSON.parse(storedUser);

        if (!user || !user.id) {

            window.location.href =
                "login.html";

            return null;
        }

        return user;

    } catch (error) {

        console.error(
            "User session error:",
            error
        );

        window.location.href =
            "login.html";

        return null;
    }
}


// =====================================================
// LOAD PROFILE
// =====================================================

function loadProfile() {

    const storedProfile =
        localStorage.getItem(
            "workforceProfile"
        );

    if (!storedProfile) {

        profile = {};

        return;
    }

    try {

        profile =
            JSON.parse(
                storedProfile
            );

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        profile = {};
    }
}


// =====================================================
// LOAD USER SKILLS FROM BACKEND
// =====================================================

async function loadUserSkills() {

    try {

        const response =
            await fetch(
                `${API_URL}/user-skills/user/${currentUser.id}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load skills."
            );
        }

        userSkills =
            await response.json();

        console.log(
            "Roadmap skills:",
            userSkills
        );


        // Keep localStorage synchronized
        const localSkills =
            userSkills.map(
                skill => ({
                    id: skill.id,
                    name: skill.skillName,
                    skillName: skill.skillName,
                    confidence:
                        Number(
                            skill.confidence
                        ) || 0,
                    performanceScore: skill.performanceScore,
                    evidenceStrength: skill.evidenceStrength || "None",
                    evidenceCount: skill.evidenceCount || 0
                })
            );

        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                localSkills
            )
        );


    } catch (error) {

        console.error(
            "Roadmap backend error:",
            error
        );

        loadSkillsFallback();
    }
}


// =====================================================
// LOCAL STORAGE FALLBACK
// =====================================================

function loadSkillsFallback() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];

        userSkills =
            stored.map(
                skill => ({
                    id: skill.id,

                    skillName:
                        skill.skillName ||
                        skill.name,

                    confidence:
                        Number(
                            skill.confidence
                        ) || 0,

                    performanceScore: skill.performanceScore,
                    evidenceStrength: skill.evidenceStrength || "None",
                    evidenceCount: skill.evidenceCount || 0
                })
            );

    } catch (error) {

        console.error(
            "Local skills error:",
            error
        );

        userSkills = [];
    }
}


// =====================================================
// GET REQUIRED SKILLS
// =====================================================

function getRequiredSkills() {

    return (
        careerSkills[
            profile.career
        ] ||
        careerSkills[
            "Java Backend Developer"
        ]
    );
}


// =====================================================
// GET CONFIDENCE
// =====================================================

function getConfidence(
    skillName
) {

    const skill =
        userSkills.find(
            item =>
                String(
                    item.skillName ||
                    item.name ||
                    ""
                ).toLowerCase() ===
                skillName.toLowerCase()
        );


    if (!skill) {
        return 0;
    }

    const val = (skill.performanceScore !== undefined && skill.performanceScore !== null)
        ? skill.performanceScore
        : skill.confidence;

    return Math.max(
        0,
        Math.min(
            100,
            Number(
                val
            ) || 0
        )
    );
}


// =====================================================
// GET STATUS
// =====================================================

function getStatus(
    skillName
) {

    const confidence =
        getConfidence(
            skillName
        );


    // Strong skill
    if (confidence >= 80) {

        return "completed";
    }


    const required =
        prerequisites[
            skillName
        ] || [];


    // Check prerequisites
    const prerequisitesReady =
        required.every(
            prerequisite =>
                getConfidence(
                    prerequisite
                ) >= 80
        );


    // Ready to learn
    if (
        prerequisitesReady &&
        confidence < 80
    ) {

        return "next";
    }


    // Has some confidence
    if (confidence > 0) {

        return "developing";
    }


    // No confidence and prerequisites
    // are not completed
    return "locked";
}


// =====================================================
// STATUS TEXT
// =====================================================

function getStatusText(
    status
) {

    switch (status) {

        case "completed":
            return "Completed";

        case "next":
            return "Next Skill";

        case "developing":
            return "Developing";

        case "locked":
            return "Locked";

        default:
            return "Not Started";
    }
}


// =====================================================
// UPDATE CAREER
// =====================================================

function updateCareer() {

    const careerElement =
        document.getElementById(
            "targetCareer"
        );

    if (!careerElement) {
        return;
    }

    careerElement.textContent =
        profile.career ||
        "Java Backend Developer";
}


// =====================================================
// RENDER ROADMAP
// =====================================================

function renderRoadmap() {

    const container =
        document.getElementById(
            "roadmapContainer"
        );


    if (!container) {

        console.warn(
            "roadmapContainer not found."
        );

        return;
    }


    const requiredSkills =
        getRequiredSkills();


    container.innerHTML = "";


    requiredSkills.forEach(
        (
            skillName,
            index
        ) => {

            const confidence =
                getConfidence(
                    skillName
                );


            const status =
                getStatus(
                    skillName
                );


            const prerequisiteList =
                prerequisites[
                    skillName
                ] || [];


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `roadmap-item ${status}`;


            let prerequisiteText =
                "";


            if (
                status === "locked" &&
                prerequisiteList.length > 0
            ) {

                const incomplete =
                    prerequisiteList.filter(
                        prerequisite =>
                            getConfidence(
                                prerequisite
                            ) < 80
                    );


                if (
                    incomplete.length > 0
                ) {

                    prerequisiteText =
                        `Requires: ${incomplete.join(", ")}`;
                }
            }


            const userSkill = userSkills.find(
                s =>
                    String(
                        s.skillName ||
                        s.name ||
                        ""
                    ).toLowerCase() ===
                    skillName.toLowerCase()
            );

            const hasEvidence =
                userSkill &&
                ((userSkill.evidenceCount && userSkill.evidenceCount > 0) ||
                    (userSkill.performanceScore !== null &&
                        userSkill.performanceScore !== undefined));

            const strength =
                userSkill && userSkill.evidenceStrength
                    ? userSkill.evidenceStrength
                    : "None";

            const scoreDisplay = hasEvidence ? `${confidence}%` : "Not assessed";


            item.innerHTML = `

                <div class="roadmap-number">
                    ${index + 1}
                </div>

                <div class="roadmap-content">

                    <div class="roadmap-header">

                        <h3>
                            ${escapeHtml(
                                skillName
                            )}
                        </h3>

                        <span class="roadmap-status ${status}">
                            ${getStatusText(
                                status
                            )}
                        </span>

                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 6px 0;">
                        <p style="margin: 0; font-size: 13px; color: var(--text-secondary, #64748b);">
                            Performance:
                            <strong style="color: var(--text-primary, #0f172a);">
                                ${scoreDisplay}
                            </strong>
                        </p>
                        <span class="strength-badge strength-${strength.toLowerCase()}" style="font-size: 10px; padding: 2px 7px;">
                            ${strength === "None" ? "No Evidence" : strength}
                        </span>
                    </div>

                    <div class="roadmap-progress">

                        <div
                            class="roadmap-progress-bar"
                            style="width:${hasEvidence ? confidence : 0}%"
                        ></div>

                    </div>

                    ${
                        prerequisiteText
                            ? `
                                <p class="roadmap-prerequisite">
                                    🔒
                                    ${escapeHtml(
                                        prerequisiteText
                                    )}
                                </p>
                              `
                            : ""
                    }

                    <div class="roadmap-actions">

                        <a
                            href="skill-detail.html?skill=${encodeURIComponent(skillName)}"
                            class="roadmap-view"
                        >
                            View Skill →
                        </a>

                        ${
                            status === "next" ||
                            status === "developing"
                                ? `
                                    <a
                                        href="skill-learning.html?skill=${encodeURIComponent(skillName)}"
                                        class="roadmap-learn"
                                    >
                                        Learn →
                                    </a>
                                  `
                                : ""
                        }

                    </div>

                </div>

            `;


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// GET NEXT SKILL
// =====================================================

function getNextSkill() {

    const requiredSkills =
        getRequiredSkills();


    // First find prerequisite-ready skill
    for (
        const skillName of
        requiredSkills
    ) {

        if (
            getStatus(
                skillName
            ) === "next"
        ) {

            return skillName;
        }
    }


    return null;
}


// =====================================================
// UPDATE NEXT BEST SKILL
// Matches YOUR roadmap.html IDs
// =====================================================

function updateNextSkillCard() {

    const nextSkill =
        getNextSkill();


    const title =
        document.getElementById(
            "nextSkill"
        );


    const description =
        document.getElementById(
            "nextSkillDescription"
        );


    const button =
        document.getElementById(
            "startLearningBtn"
        );


    // -----------------------------------------
    // NO NEXT SKILL
    // -----------------------------------------

    if (!nextSkill) {

        if (title) {

            title.textContent =
                "All skills completed";
        }


        if (description) {

            description.textContent =
                "All tracked skills have reached the strong confidence level.";
        }


        if (button) {

            button.href =
                "progress.html";

            button.textContent =
                "View Progress →";
        }


        return;
    }


    // -----------------------------------------
    // NEXT SKILL FOUND
    // -----------------------------------------

    const confidence =
        getConfidence(
            nextSkill
        );


    if (title) {

        title.textContent =
            nextSkill;
    }


    if (description) {

        description.textContent =
            `Current confidence: ${confidence}%. WorkforceIQ identified this as the next prerequisite-ready skill in your roadmap.`;
    }


    if (button) {

        button.href =
            `skill-learning.html?skill=${encodeURIComponent(nextSkill)}`;

        button.textContent =
            "Start Learning →";
    }
}


// =====================================================
// UPDATE TODAY'S ACTION
// =====================================================

function updateTodayAction() {

    const nextSkill =
        getNextSkill();


    const title =
        document.getElementById(
            "todayAction"
        );


    const description =
        document.getElementById(
            "todayDescription"
        );


    if (!title || !description) {
        return;
    }


    if (!nextSkill) {

        title.textContent =
            "Review your completed skills";


        description.textContent =
            "Keep practicing your strongest skills and add fresh evidence regularly to maintain your confidence.";

        return;
    }


    const confidence =
        getConfidence(
            nextSkill
        );


    const prerequisiteList =
        prerequisites[
            nextSkill
        ] || [];


    title.textContent =
        `Learn ${nextSkill} fundamentals`;


    if (
        prerequisiteList.length > 0
    ) {

        description.textContent =
            `${nextSkill} is now ready because its prerequisites are completed. Current confidence: ${confidence}%. Start learning and practice the skill.`;

    } else {

        description.textContent =
            `Start learning ${nextSkill}. It has no tracked prerequisites and is currently ready in your roadmap.`;
    }
}


// =====================================================
// OPTIONAL SUMMARY
// =====================================================

function updateSummary() {

    const requiredSkills =
        getRequiredSkills();


    let completed = 0;
    let developing = 0;
    let locked = 0;


    requiredSkills.forEach(
        skillName => {

            const status =
                getStatus(
                    skillName
                );


            if (
                status === "completed"
            ) {

                completed++;

            } else if (
                status === "developing"
            ) {

                developing++;

            } else if (
                status === "locked"
            ) {

                locked++;
            }
        }
    );


    const completedElement =
        document.getElementById(
            "completedSkills"
        );


    const developingElement =
        document.getElementById(
            "developingSkills"
        );


    const lockedElement =
        document.getElementById(
            "lockedSkills"
        );


    if (completedElement) {

        completedElement.textContent =
            completed;
    }


    if (developingElement) {

        developingElement.textContent =
            developing;
    }


    if (lockedElement) {

        lockedElement.textContent =
            locked;
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value || ""
    )
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


// =====================================================
// INITIALIZE
// =====================================================

async function initializeRoadmap() {

    currentUser =
        getLoggedInUser();


    if (!currentUser) {
        return;
    }


    loadProfile();


    updateCareer();


    await loadUserSkills();


    updateSummary();


    renderRoadmap();


    updateNextSkillCard();


    updateTodayAction();


    console.log(
        "WorkforceIQ Roadmap loaded."
    );
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeRoadmap
);