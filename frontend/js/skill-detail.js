// =====================================================
// WORKFORCEIQ - SKILL DETAIL
// BACKEND CONNECTED
// =====================================================

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let userSkills = [];
let skillEvidence = [];


// =====================================================
// GET USER
// =====================================================

function getLoggedInUser() {

    const storedUser =
        localStorage.getItem("workforceLoggedInUser");

    if (!storedUser) {
        window.location.href = "login.html";
        return null;
    }

    try {

        const user = JSON.parse(storedUser);

        if (!user || !user.id) {
            window.location.href = "login.html";
            return null;
        }

        return user;

    } catch (error) {

        console.error("User session error:", error);

        window.location.href = "login.html";

        return null;
    }
}


// =====================================================
// SELECTED SKILL
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const skillName =
    params.get("skill");


// =====================================================
// SKILL DESCRIPTIONS
// =====================================================

const skillDescriptions = {

    "Java Fundamentals":
        "Core Java programming concepts used for backend application development.",

    "OOP":
        "Object-Oriented Programming concepts such as classes, objects, inheritance and polymorphism.",

    "Data Structures":
        "Data structures used to organize and process data efficiently.",

    "SQL":
        "Language used to store, retrieve and manipulate data in relational databases.",

    "REST API":
        "Techniques used to build APIs that allow applications to communicate with each other.",

    "Spring Boot":
        "Java framework used to build production-ready backend applications.",

    "Git":
        "Version control system used to manage and track changes in software projects.",

    "HTML":
        "Markup language used to structure web pages.",

    "CSS":
        "Styling language used to design and layout web pages.",

    "JavaScript":
        "Programming language used to create interactive web applications.",

    "React":
        "JavaScript library used to build modern user interfaces.",

    "Python":
        "General-purpose programming language widely used for data analysis and automation.",

    "Statistics":
        "Methods used to understand, analyze and interpret data.",

    "Excel":
        "Spreadsheet tool used for data organization and analysis.",

    "Data Visualization":
        "Techniques used to represent data through charts and visual formats.",

    "Power BI":
        "Business intelligence tool used to analyze and visualize data.",

    "Linux":
        "Operating system widely used for servers and cloud environments.",

    "Networking":
        "Fundamentals of communication between computers and networked systems.",

    "AWS":
        "Cloud platform providing infrastructure and application services.",

    "Docker":
        "Containerization technology used to package and run applications consistently.",

    "Kubernetes":
        "Platform used to manage containerized applications."
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
// LOAD USER SKILLS FROM BACKEND
// =====================================================

async function loadUserSkills() {

    try {

        const response =
            await fetch(
                `${API_URL}/user-skills/user/${currentUser.id}`
            );

        if (!response.ok) {
            throw new Error("Unable to load skills");
        }

        userSkills =
            await response.json();

        console.log(
            "Skill Detail - User Skills:",
            userSkills
        );

        // Synchronize localStorage
        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                userSkills.map(skill => ({
                    id: skill.id,
                    name: skill.skillName,
                    skillName: skill.skillName,
                    confidence:
                        Number(skill.confidence) || 0
                }))
            )
        );

    } catch (error) {

        console.error(
            "Backend skill loading failed:",
            error
        );

        loadSkillsFromLocalStorage();
    }
}


// =====================================================
// LOCAL STORAGE FALLBACK
// =====================================================

function loadSkillsFromLocalStorage() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];

        userSkills =
            stored.map(skill => ({
                id: skill.id,

                skillName:
                    skill.skillName ||
                    skill.name,

                confidence:
                    Number(
                        skill.confidence
                    ) || 0
            }));

    } catch (error) {

        console.error(
            "Local skill loading failed:",
            error
        );

        userSkills = [];
    }
}


// =====================================================
// LOAD EVIDENCE FROM BACKEND
// =====================================================

async function loadSkillEvidence() {

    try {

        const response =
            await fetch(
                `${API_URL}/evidence/user/${currentUser.id}/skill/${encodeURIComponent(skillName)}`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load evidence"
            );
        }

        skillEvidence =
            await response.json();

        console.log(
            "Skill Detail - Evidence:",
            skillEvidence
        );

        // Synchronize localStorage
        syncEvidenceToLocalStorage();

    } catch (error) {

        console.error(
            "Backend evidence loading failed:",
            error
        );

        loadEvidenceFromLocalStorage();
    }
}


// =====================================================
// LOCAL EVIDENCE FALLBACK
// =====================================================

function loadEvidenceFromLocalStorage() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "workforceEvidence"
                )
            ) || [];

        skillEvidence =
            stored.filter(item => {

                const storedSkill =
                    item.skill ||
                    item.skillName ||
                    "";

                return (
                    storedSkill.toLowerCase() ===
                    skillName.toLowerCase()
                );
            });

    } catch (error) {

        console.error(
            "Local evidence error:",
            error
        );

        skillEvidence = [];
    }
}


// =====================================================
// SYNC EVIDENCE
// =====================================================

async function syncEvidenceToLocalStorage() {

    try {

        const response =
            await fetch(
                `${API_URL}/evidence/user/${currentUser.id}`
            );

        if (!response.ok) {
            return;
        }

        const allEvidence =
            await response.json();

        const formatted =
            allEvidence.map(item => ({
                id: item.id,

                skill:
                    item.skillName,

                skillName:
                    item.skillName,

                type:
                    item.evidenceType,

                score:
                    item.score,

                description:
                    item.description,

                date:
                    item.createdAt
            }));

        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(formatted)
        );

    } catch (error) {

        console.log(
            "Evidence local sync skipped."
        );
    }
}


// =====================================================
// GET USER SKILL
// =====================================================

function getUserSkill(
    name
) {

    return userSkills.find(
        skill =>
            String(
                skill.skillName ||
                skill.name ||
                ""
            ).toLowerCase() ===
            name.toLowerCase()
    );
}


// =====================================================
// GET CURRENT CONFIDENCE
// =====================================================

function getConfidence() {

    const skill =
        getUserSkill(
            skillName
        );

    if (!skill) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Number(
                skill.confidence
            ) || 0
        )
    );
}


// =====================================================
// STATUS
// =====================================================

function getStatus(
    confidence
) {

    if (confidence >= 80) {

        return {
            text: "STRONG",
            className: "strong"
        };
    }

    if (confidence >= 50) {

        return {
            text: "DEVELOPING",
            className: "developing"
        };
    }

    return {
        text: "BASIC",
        className: "basic"
    };
}


// =====================================================
// LOAD PAGE
// =====================================================

async function loadSkillDetail() {

    if (!skillName) {

        const nameElement =
            document.getElementById(
                "skillName"
            );

        if (nameElement) {
            nameElement.textContent =
                "Skill Not Found";
        }

        return;
    }


    currentUser =
        getLoggedInUser();


    if (!currentUser) {
        return;
    }


    // Load actual backend data
    await loadUserSkills();

    await loadSkillEvidence();


    const confidence =
        getConfidence();


    // =================================================
    // SKILL NAME
    // =================================================

    const nameElement =
        document.getElementById(
            "skillName"
        );

    if (nameElement) {

        nameElement.textContent =
            skillName;
    }


    // =================================================
    // DESCRIPTION
    // =================================================

    const descriptionElement =
        document.getElementById(
            "skillDescription"
        );

    if (descriptionElement) {

        descriptionElement.textContent =
            skillDescriptions[
                skillName
            ] ||
            "Skill required for your selected career path.";
    }


    // =================================================
    // CONFIDENCE
    // =================================================

    const confidenceElement =
        document.getElementById(
            "skillConfidence"
        );

    if (confidenceElement) {

        confidenceElement.textContent =
            confidence + "%";
    }


    // =================================================
    // PROGRESS BAR
    // =================================================

    const progressBar =
        document.getElementById(
            "confidenceProgress"
        );

    if (progressBar) {

        progressBar.style.width =
            confidence + "%";
    }


    // =================================================
    // STATUS
    // =================================================

    const status =
        getStatus(
            confidence
        );

    const statusElement =
        document.getElementById(
            "skillStatus"
        );

    if (statusElement) {

        statusElement.textContent =
            status.text;

        statusElement.className =
            "skill-status " +
            status.className;
    }


    // =================================================
    // PREREQUISITES
    // =================================================

    renderPrerequisites();


    // =================================================
    // SKILL GAP
    // =================================================

    renderSkillGap(
        confidence
    );


    // =================================================
    // EVIDENCE
    // =================================================

    renderEvidence();


    // =================================================
    // RECOMMENDED ACTION
    // =================================================

    renderRecommendedAction(
        confidence
    );


    // =================================================
    // LEARNING BUTTON
    // =================================================

    setupLearningButton();
}


// =====================================================
// PREREQUISITES
// =====================================================

function renderPrerequisites() {

    const container =
        document.getElementById(
            "prerequisites"
        );

    if (!container) {
        return;
    }


    const required =
        prerequisites[
            skillName
        ] || [];


    if (required.length === 0) {

        container.innerHTML = `
            <p class="no-prerequisite">
                No prerequisites. You can start learning this skill directly.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    required.forEach(
        prerequisite => {

            const skill =
                getUserSkill(
                    prerequisite
                );


            const confidence =
                skill
                    ? Number(
                        skill.confidence
                    ) || 0
                    : 0;


            const completed =
                confidence >= 80;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "prerequisite-item";


            item.innerHTML = `

                <span>
                    ${escapeHtml(
                        prerequisite
                    )}
                </span>

                <span class="${
                    completed
                        ? "completed"
                        : "not-completed"
                }">

                    ${
                        completed
                            ? "✓ Completed"
                            : "⚠ Needs Improvement"
                    }

                </span>

            `;


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// SKILL GAP
// =====================================================

function renderSkillGap(
    confidence
) {

    const gapElement =
        document.getElementById(
            "skillGap"
        );

    if (!gapElement) {
        return;
    }


    const gap =
        Math.max(
            0,
            80 - confidence
        );


    if (confidence >= 80) {

        gapElement.textContent =
            "You have reached the strong confidence level for this skill.";

    } else {

        gapElement.textContent =
            `You need approximately ${gap}% more confidence to reach the strong level.`;
    }
}


// =====================================================
// EVIDENCE
// =====================================================

function renderEvidence() {

    const container =
        document.getElementById(
            "skillEvidence"
        );

    if (!container) {
        return;
    }


    if (
        !skillEvidence ||
        skillEvidence.length === 0
    ) {

        container.innerHTML = `
            <p class="no-evidence">
                No evidence has been added for this skill yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    const sortedEvidence =
        [...skillEvidence]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt ||
                        b.date
                    ) -
                    new Date(
                        a.createdAt ||
                        a.date
                    )
            );


    sortedEvidence.forEach(
        item => {

            const type =
                item.evidenceType ||
                item.type ||
                "Evidence";


            const score =
                Number(
                    item.score
                ) || 0;


            const description =
                item.description ||
                "No description provided.";


            const dateValue =
                item.createdAt ||
                item.date;


            const date =
                dateValue
                    ? new Date(
                        dateValue
                    ).toLocaleDateString()
                    : "";


            const evidenceItem =
                document.createElement(
                    "div"
                );


            evidenceItem.className =
                "evidence-item";


            evidenceItem.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            formatEvidenceType(
                                type
                            )
                        )}
                    </strong>

                    <p>
                        ${escapeHtml(
                            description
                        )}
                    </p>

                    <small>
                        ${date}
                    </small>

                </div>

                <span class="evidence-score">
                    ${score}%
                </span>

            `;


            container.appendChild(
                evidenceItem
            );
        }
    );
}


// =====================================================
// FORMAT EVIDENCE TYPE
// =====================================================

function formatEvidenceType(
    type
) {

    const value =
        String(type)
            .toLowerCase();


    if (
        value === "problems"
    ) {
        return "Coding Problems";
    }


    if (
        value === "practice"
    ) {
        return "Recent Practice";
    }


    if (
        value === "assessment"
    ) {
        return "Assessment";
    }


    if (
        value === "project"
    ) {
        return "Project";
    }


    return type;
}


// =====================================================
// RECOMMENDED ACTION
// =====================================================

function renderRecommendedAction(
    confidence
) {

    const container =
        document.getElementById(
            "recommendedAction"
        );

    if (!container) {
        return;
    }


    if (confidence >= 80) {

        container.innerHTML = `

            <strong>
                Maintain this skill.
            </strong>

            <p>
                Keep practicing and add recent evidence
                regularly to maintain your confidence.
            </p>

        `;

        return;
    }


    if (confidence >= 50) {

        container.innerHTML = `

            <strong>
                Practice this skill.
            </strong>

            <p>
                Work on practice problems, assessments
                or a small project to increase your confidence.
            </p>

        `;

        return;
    }


    container.innerHTML = `

        <strong>
            Focus on learning this skill.
        </strong>

        <p>
            Start with the fundamentals and build practical
            evidence through learning, practice and projects.
        </p>

    `;
}


// =====================================================
// LEARNING BUTTON
// =====================================================

function setupLearningButton() {

    const buttons =
        document.querySelectorAll(
            "a"
        );


    buttons.forEach(
        button => {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes(
                    "view my roadmap"
                )
            ) {
                return;
            }


            if (
                text.includes(
                    "add evidence"
                )
            ) {

                button.href =
                    `evidence.html?skill=${encodeURIComponent(skillName)}`;
            }
        }
    );
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
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    loadSkillDetail
);