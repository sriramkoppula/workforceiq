// =====================================================
// WORKFORCEIQ - DASHBOARD
// Backend Connected - Final Version
// =====================================================

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let profile = null;
let userSkills = [];
let evidence = [];


// =====================================================
// CAREER SKILL MAP
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
        "Java Fundamentals"
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

    "Python": [],

    "Statistics": [],

    "Excel": [],

    "Data Visualization": [
        "Python",
        "SQL"
    ],

    "Power BI": [
        "SQL",
        "Data Visualization"
    ],

    "Linux": [],

    "Networking": [
        "Linux"
    ],

    "AWS": [
        "Networking",
        "Linux"
    ],

    "Docker": [
        "Linux"
    ],

    "Kubernetes": [
        "Docker"
    ]
};


// =====================================================
// GET USER
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


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    if (
        !currentUser ||
        !currentUser.id
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/${currentUser.id}`
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load profile"
            );
        }


        profile =
            await response.json();


        localStorage.setItem(
            "workforceProfile",
            JSON.stringify(profile)
        );


        return true;

    } catch (error) {

        console.error(error);


        profile =
            JSON.parse(
                localStorage.getItem(
                    "workforceProfile"
                )
            ) || null;


        return !!profile;
    }
}


// =====================================================
// LOAD SKILLS FROM BACKEND
// =====================================================

async function loadSkills() {

    try {

        const response =
            await fetch(
                `${API_URL}/user-skills/user/${currentUser.id}`
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load skills"
            );
        }


        userSkills =
            await response.json();


        if (!Array.isArray(userSkills)) {
            userSkills = [];
        }


        // Synchronize localStorage only.
        // Dashboard calculations use backend data.
        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                userSkills.map(
                    skill => ({
                        id: skill.id,
                        name: skill.skillName,
                        confidence: skill.confidence
                    })
                )
            )
        );

    } catch (error) {

        console.error(
            "Skill loading error:",
            error
        );


        // Fallback only if backend unavailable
        const local =
            JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];


        userSkills =
            local.map(
                skill => ({
                    skillName:
                        skill.name,

                    confidence:
                        skill.confidence
                })
            );
    }
}


// =====================================================
// LOAD EVIDENCE
// =====================================================

async function loadEvidence() {

    try {

        const response =
            await fetch(
                `${API_URL}/evidence/user/${currentUser.id}`
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load evidence"
            );
        }


        evidence =
            await response.json();


        if (!Array.isArray(evidence)) {
            evidence = [];
        }


        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(
                evidence
            )
        );

    } catch (error) {

        console.error(
            "Evidence loading error:",
            error
        );


        evidence =
            JSON.parse(
                localStorage.getItem(
                    "workforceEvidence"
                )
            ) || [];
    }
}


// =====================================================
// GET CAREER
// =====================================================

function getCareer() {

    return (
        profile?.career ||
        ""
    );
}


// =====================================================
// GET REQUIRED SKILLS
// =====================================================

function getRequiredSkills() {

    return (
        careerSkills[
            getCareer()
        ] || []
    );
}


// =====================================================
// FIND USER SKILL
// =====================================================

function getUserSkill(
    skillName
) {

    return userSkills.find(
        skill =>
            String(
                skill.skillName || ""
            ).toLowerCase() ===
            String(
                skillName
            ).toLowerCase()
    );
}


// =====================================================
// GET CONFIDENCE
// =====================================================

function getConfidence(
    skillName
) {

    const skill =
        getUserSkill(
            skillName
        );


    if (!skill) {
        return 0;
    }


    return Number(
        skill.confidence
    ) || 0;
}


// =====================================================
// PREREQUISITES COMPLETED?
// =====================================================

function prerequisitesCompleted(
    skillName
) {

    const required =
        prerequisites[
            skillName
        ] || [];


    return required.every(
        prerequisite =>
            getConfidence(
                prerequisite
            ) >= 80
    );
}


// =====================================================
// NEXT BEST SKILL
//
// Rules:
// 1. Only use skills for selected career.
// 2. Ignore unrelated localStorage skills.
// 3. Completed = confidence >= 80.
// 4. Prerequisites must be completed.
// 5. Prefer the first available incomplete skill.
// =====================================================

function getNextSkill() {

    const requiredSkills =
        getRequiredSkills();


    if (
        requiredSkills.length === 0
    ) {
        return null;
    }


    for (
        const skillName
        of requiredSkills
    ) {

        const confidence =
            getConfidence(
                skillName
            );


        if (
            confidence >= 80
        ) {
            continue;
        }


        if (
            prerequisitesCompleted(
                skillName
            )
        ) {

            return skillName;
        }
    }


    // If every currently available
    // skill is complete, look for the
    // first incomplete skill whose
    // prerequisites are closest.
    return null;
}


// =====================================================
// READINESS
// =====================================================

function calculateReadiness() {

    const requiredSkills =
        getRequiredSkills();


    if (
        requiredSkills.length === 0
    ) {
        return 0;
    }


    let total = 0;


    requiredSkills.forEach(
        skillName => {

            total +=
                getConfidence(
                    skillName
                );
        }
    );


    return Math.round(
        total /
        requiredSkills.length
    );
}


// =====================================================
// UPDATE BASIC ELEMENT
// =====================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.textContent =
            value;
    }
}


// =====================================================
// LOAD USER NAME / CAREER
// =====================================================

function renderUserInfo() {

    setText(
        "userName",
        currentUser?.name ||
        profile?.name ||
        "Student"
    );


    setText(
        "careerText",
        getCareer() ||
        "Target career not selected"
    );


    setText(
        "targetCareer",
        getCareer() ||
        "Target career"
    );
}


// =====================================================
// SUMMARY
// =====================================================

function renderSummary() {

    const requiredSkills =
        getRequiredSkills();


    const readiness =
        calculateReadiness();


    let strong = 0;
    let developing = 0;
    let missing = 0;


    requiredSkills.forEach(
        skillName => {

            const confidence =
                getConfidence(
                    skillName
                );


            if (
                confidence >= 80
            ) {

                strong++;

            } else if (
                confidence > 0
            ) {

                developing++;

            } else {

                missing++;
            }
        }
    );


    setText(
        "readinessScore",
        readiness + "%"
    );


    setText(
        "skillsCount",
        userSkills.length
    );


    setText(
        "evidenceCount",
        evidence.length
    );


    setText(
        "strongCount",
        strong
    );


    setText(
        "developingCount",
        developing
    );


    setText(
        "missingCount",
        missing
    );
}


// =====================================================
// DETAILED SKILL GAP
// =====================================================

function renderSkillGap() {

    const container =
        document.getElementById(
            "detailedGap"
        );


    if (!container) {
        return;
    }


    const requiredSkills =
        getRequiredSkills();


    container.innerHTML = "";


    requiredSkills.forEach(
        skillName => {

            const confidence =
                getConfidence(
                    skillName
                );


            let status =
                "Missing";


            if (
                confidence >= 80
            ) {

                status =
                    "Strong";

            } else if (
                confidence > 0
            ) {

                status =
                    "Developing";
            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gap-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            skillName
                        )}
                    </strong>

                    <span>
                        ${status}
                    </span>

                </div>

                <div>

                    <span>
                        ${confidence}%
                    </span>

                </div>

            `;


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// NEXT BEST SKILL CARD
// =====================================================

function renderNextSkill() {

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
            "startLearningButton"
        );


    if (!nextSkill) {

        if (title) {

            title.textContent =
                "Career Path Progressing";
        }


        if (description) {

            description.textContent =
                "Continue strengthening your remaining skills and collecting evidence.";
        }


        if (button) {

            button.href =
                "roadmap.html";

            button.textContent =
                "View Roadmap →";
        }


        return;
    }


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
            `Current confidence: ${confidence}%. This skill is ready for focused learning and practice.`;
    }


    if (button) {

        button.href =
            `skill-learning.html?skill=${encodeURIComponent(nextSkill)}`;

        button.textContent =
            "Start Learning →";
    }
}


// =====================================================
// RECOMMENDED LEARNING
// =====================================================

function renderRecommendedLearning() {

    const container =
        document.getElementById(
            "recommendedLearning"
        );


    if (!container) {
        return;
    }


    const requiredSkills =
        getRequiredSkills();


    const learningSkills =
        requiredSkills.filter(
            skillName =>
                getConfidence(
                    skillName
                ) < 80
        );


    container.innerHTML = "";


    learningSkills
        .slice(0, 4)
        .forEach(
            skillName => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "learning-recommendation";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            skillName
                        )}
                    </h3>

                    <p>
                        Current confidence:
                        ${getConfidence(
                            skillName
                        )}%
                    </p>

                    <a
                        href="skill-learning.html?skill=${encodeURIComponent(skillName)}"
                    >
                        Learn →
                    </a>

                `;


                container.appendChild(
                    card
                );
            }
        );
}


// =====================================================
// RECENT EVIDENCE
// =====================================================

function renderRecentEvidence() {

    const container =
        document.getElementById(
            "recentEvidence"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    evidence
        .slice(0, 5)
        .forEach(
            item => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "recent-evidence-item";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.skillName
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.evidenceType
                            )}
                        </span>

                    </div>

                    <strong>
                        ${Number(
                            item.score
                        )}%
                    </strong>

                `;


                container.appendChild(
                    row
                );
            }
        );
}


// =====================================================
// RADAR
// =====================================================

function renderRadar() {

    const canvas =
        document.getElementById(
            "skillRadar"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    const requiredSkills =
        getRequiredSkills();


    const labels =
        requiredSkills;


    const values =
        requiredSkills.map(
            skill =>
                getConfidence(
                    skill
                )
        );


    if (
        window.workforceRadarChart
    ) {

        window.workforceRadarChart.destroy();
    }


    window.workforceRadarChart =
        new Chart(
            canvas,
            {
                type: "radar",

                data: {

                    labels,

                    datasets: [
                        {
                            label:
                                "Skill Confidence",

                            data:
                                values,

                            fill:
                                true
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        r: {

                            min: 0,

                            max: 100,

                            ticks: {
                                stepSize: 20
                            }
                        }
                    },

                    plugins: {

                        legend: {
                            display: true
                        }
                    }
                }
            }
        );
}


// =====================================================
// BUTTONS
// =====================================================

function setupDashboardButtons() {

    const startLearningButton =
        document.getElementById("startLearningButton");

    if (startLearningButton) {

        startLearningButton.onclick = function (event) {

            event.preventDefault();

            const nextSkillElement =
                document.getElementById("nextSkill");

            if (!nextSkillElement) {
                console.error("nextSkill element not found.");
                return;
            }

            const nextSkill =
                nextSkillElement.textContent.trim();

            if (
                !nextSkill ||
                nextSkill === "Analyzing..." ||
                nextSkill === "No skill available"
            ) {
                alert("No learning skill is available right now.");
                return;
            }

            console.log(
                "Starting learning for:",
                nextSkill
            );

            window.location.href =
                "skill-learning.html?skill=" +
                encodeURIComponent(nextSkill);
        };
    }


    const skillsButton =
        document.getElementById("viewSkillsButton");

    if (skillsButton) {
        skillsButton.onclick = function () {
            window.location.href = "skills.html";
        };
    }


    const evidenceButton =
        document.getElementById("viewEvidenceButton");

    if (evidenceButton) {
        evidenceButton.onclick = function () {
            window.location.href = "evidence.html";
        };
    }


    const roadmapButton =
        document.getElementById("viewRoadmapButton");

    if (roadmapButton) {
        roadmapButton.onclick = function () {
            window.location.href = "roadmap.html";
        };
    }


    const learningButton =
        document.getElementById("viewLearningButton");

    if (learningButton) {
        learningButton.onclick = function () {
            window.location.href = "learning.html";
        };
    }


    const progressButton =
        document.getElementById("viewProgressButton");

    if (progressButton) {
        progressButton.onclick = function () {
            window.location.href = "progress.html";
        };
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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

async function initializeDashboard() {

    currentUser =
        getLoggedInUser();


    if (
        !currentUser ||
        !currentUser.id
    ) {

        window.location.href =
            "login.html";

        return;
    }


    const profileLoaded =
        await loadProfile();


    if (!profileLoaded) {
        return;
    }


    await loadSkills();

    await loadEvidence();


    renderUserInfo();

    renderSummary();

    renderSkillGap();

    renderNextSkill();

    renderRecommendedLearning();

    renderRecentEvidence();

    renderRadar();

    setupDashboardButtons();
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);