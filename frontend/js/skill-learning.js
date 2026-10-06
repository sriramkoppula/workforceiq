// =====================================================
// WORKFORCEIQ - SKILL LEARNING
// =====================================================

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let userSkills = [];
let learningProgress = [];
async function loadLearningProgress() {

    if (!currentUser || !currentUser.id) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/learning-progress/user/${currentUser.id}`
            );

        if (!response.ok) {
            throw new Error("Unable to load learning progress");
        }

        learningProgress =
            await response.json();

        console.log(
            "Skill learning progress loaded from MySQL:",
            learningProgress
        );

    } catch (error) {

        console.error(
            "Learning progress error:",
            error
        );

        learningProgress = [];
    }
}


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
// TOPICS
// =====================================================

const skillTopics = {

    "Java Fundamentals": [
        "Variables and Data Types",
        "Control Flow",
        "Methods",
        "Arrays",
        "Strings"
    ],

    "OOP": [
        "Classes and Objects",
        "Constructors",
        "Encapsulation",
        "Inheritance",
        "Polymorphism",
        "Abstraction"
    ],

    "Data Structures": [
        "Arrays",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Hashing",
        "Trees"
    ],

    "SQL": [
        "SQL Fundamentals",
        "SELECT Queries",
        "Filtering and Sorting",
        "GROUP BY",
        "Joins",
        "Subqueries"
    ],

    "REST API": [
        "HTTP Fundamentals",
        "REST Principles",
        "HTTP Methods",
        "API Requests",
        "API Responses"
    ],

    "Spring Boot": [
        "Spring Boot Fundamentals",
        "Controllers",
        "REST APIs",
        "JPA",
        "Database Integration"
    ],

    "Git": [
        "Git Fundamentals",
        "Repositories",
        "Commits",
        "Branches",
        "GitHub"
    ],

    "HTML": [
        "HTML Fundamentals",
        "Forms",
        "Tables",
        "Semantic HTML"
    ],

    "CSS": [
        "CSS Fundamentals",
        "Selectors",
        "Box Model",
        "Flexbox",
        "Grid"
    ],

    "JavaScript": [
        "JavaScript Fundamentals",
        "Functions",
        "Arrays",
        "Objects",
        "DOM"
    ],

    "React": [
        "React Fundamentals",
        "Components",
        "Props",
        "State",
        "Hooks"
    ]
};


// =====================================================
// DESCRIPTIONS
// =====================================================

const skillDescriptions = {

    "Java Fundamentals":
        "Learn the core concepts of Java programming.",

    "OOP":
        "Object-oriented programming concepts such as classes, objects, inheritance and polymorphism.",

    "Data Structures":
        "Learn how to organize and efficiently manage data using common data structures.",

    "SQL":
        "Learn how to store, retrieve and analyze data using SQL.",

    "REST API":
        "Learn how applications communicate using RESTful APIs.",

    "Spring Boot":
        "Learn how to build Java backend applications using Spring Boot.",

    "Git":
        "Learn version control and collaborative software development using Git."
};


// =====================================================
// GET USER
// =====================================================

function getCurrentUser() {

    const stored =
        localStorage.getItem(
            "workforceLoggedInUser"
        );

    if (!stored) {

        window.location.href =
            "login.html";

        return null;
    }

    try {

        const user =
            JSON.parse(stored);

        if (!user || !user.id) {

            window.location.href =
                "login.html";

            return null;
        }

        return user;

    } catch {

        window.location.href =
            "login.html";

        return null;
    }
}


// =====================================================
// SELECTED SKILL
// =====================================================

function getSelectedSkill() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("skill") ||
        "Java Fundamentals"
    );
}


// =====================================================
// LOAD USER SKILLS
// =====================================================

async function loadUserSkills() {

    try {

        const response =
            await fetch(
                `${API_URL}/user-skills/user/${currentUser.id}`
            );

        if (!response.ok) {
            throw new Error("Failed to load skills");
        }

        userSkills =
            await response.json();

    } catch (error) {

        console.error(error);

        try {

            userSkills =
                JSON.parse(
                    localStorage.getItem(
                        "workforceSkills"
                    )
                ) || [];

        } catch {

            userSkills = [];
        }
    }
}


// =====================================================
// CONFIDENCE
// =====================================================

function getConfidence(skillName) {

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

    return skill
        ? Number(skill.confidence) || 0
        : 0;
}


// =====================================================
// TOPIC PROGRESS
// =====================================================

function getTopicProgress(skillName, topic) {

    // Check MySQL data first
    const backendProgress =
        learningProgress.find(
            item =>
                item.skillName === skillName &&
                item.topicName === topic
        );

    if (backendProgress) {
        return (
            backendProgress.completed === true ||
            backendProgress.completed === 1
        );
    }

    // Fallback to localStorage
    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "workforceTopicProgress"
                )
            ) || {};

        return Boolean(
            data?.[skillName]?.[topic]?.completed
        );

    } catch {

        return false;
    }
}


// =====================================================
// SKILL LEARNING PROGRESS
// =====================================================

function calculateLearningProgress(skillName) {

    const topics =
        skillTopics[skillName] || [];

    if (topics.length === 0) {
        return 0;
    }

    const completed =
        topics.filter(
            topic =>
                getTopicProgress(
                    skillName,
                    topic
                )
        ).length;

    return Math.round(
        (completed / topics.length) * 100
    );
}


// =====================================================
// PREREQUISITES
// =====================================================

function renderPrerequisites(skillName) {

    const container =
        document.getElementById(
            "prerequisitesList"
        );

    if (!container) {
        return;
    }

    const required =
        prerequisites[skillName] || [];


    if (required.length === 0) {

        container.innerHTML = `
            <div class="prerequisite-item">
                <span>No prerequisites required.</span>
                <span>✓ Ready</span>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    required.forEach(
        prerequisite => {

            const confidence =
                getConfidence(
                    prerequisite
                );

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
                    ${prerequisite}
                </span>

                <span>
                    ${
                        completed
                            ? "✓ Completed"
                            : confidence + "% confidence"
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
// CURRICULUM
// =====================================================

function renderCurriculum(skillName) {

    const container =
        document.getElementById(
            "curriculumList"
        );

    if (!container) {
        return;
    }


    const topics =
        skillTopics[skillName] || [];


    if (topics.length === 0) {

        container.innerHTML = `
            <p>
                Learning content for this skill is coming soon.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    topics.forEach(
        (topic, index) => {

            const completed =
                getTopicProgress(
                    skillName,
                    topic
                );


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "topic-item";


            item.innerHTML = `

                <div>

                    <span class="topic-number">
                        ${index + 1}
                    </span>

                    <strong>
                        ${topic}
                    </strong>

                </div>

                <button
                    type="button"
                    class="topic-button"
                >
                    ${
                        completed
                            ? "Review →"
                            : "Learn →"
                    }
                </button>

            `;


            item
                .querySelector(
                    ".topic-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `topic.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topic)}`;

                    }
                );


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// UPDATE PROGRESS UI
// =====================================================

function updateProgressUI(skillName) {

    const progress =
        calculateLearningProgress(
            skillName
        );


    const progressText =
        document.getElementById(
            "learningProgress"
        );

    const progressBar =
        document.getElementById(
            "learningProgressBar"
        );

    const status =
        document.getElementById(
            "learningStatus"
        );


    if (progressText) {
        progressText.textContent =
            progress + "%";
    }


    if (progressBar) {
        progressBar.style.width =
            progress + "%";
    }


    if (status) {

        if (progress === 0) {

            status.textContent =
                "Not Started";

        } else if (progress < 100) {

            status.textContent =
                "In Progress";

        } else {

            status.textContent =
                "Completed";
        }
    }
}


// =====================================================
// HEADER
// =====================================================

function renderHeader(skillName) {

    const name =
        document.getElementById(
            "skillName"
        );

    const description =
        document.getElementById(
            "skillDescription"
        );

    const confidence =
        document.getElementById(
            "skillConfidence"
        );


    if (name) {
        name.textContent =
            skillName;
    }


    if (description) {

        description.textContent =
            skillDescriptions[
                skillName
            ] ||
            `Learn ${skillName} step by step.`;
    }


    if (confidence) {

        confidence.textContent =
            getConfidence(
                skillName
            ) + "%";
    }
}


// =====================================================
// RESOURCE LINKS
// =====================================================

function setupResources(skillName) {

    const encoded =
        encodeURIComponent(
            skillName
        );


    const documentation =
        document.getElementById(
            "documentationLink"
        );

    const video =
        document.getElementById(
            "videoLink"
        );

    const practice =
        document.getElementById(
            "practiceLink"
        );


    if (documentation) {

        documentation.href =
            `https://www.google.com/search?q=${encoded}+official+documentation`;
    }


    if (video) {

        video.href =
            `https://www.youtube.com/results?search_query=${encoded}+tutorial`;
    }


    if (practice) {

        practice.href =
            `https://www.google.com/search?q=${encoded}+practice+problems`;
    }
}


// =====================================================
// PRACTICE
// =====================================================

function setupPractice(skillName) {

    const button =
        document.getElementById(
            "practiceButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const topics =
                skillTopics[skillName] || [];

            const topic =
                topics[0] ||
                skillName;


            window.location.href =
                `practice.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topic)}`;
        }
    );
}


// =====================================================
// ASSESSMENT
// =====================================================

function setupAssessment(skillName) {

    const button =
        document.getElementById(
            "assessmentButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const topics =
                skillTopics[skillName] || [];

            const topic =
                topics[0] ||
                skillName;


            window.location.href =
                `assessment.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topic)}`;
        }
    );
}


// =====================================================
// PROJECT
// =====================================================

function setupProject(skillName) {

    const button =
        document.getElementById(
            "projectButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const topics =
                skillTopics[skillName] || [];

            const topic =
                topics[0] ||
                skillName;


            window.location.href =
                `projects.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topic)}`;
        }
    );
}


// =====================================================
// EVIDENCE
// =====================================================

function setupEvidence(skillName) {

    const button =
        document.getElementById(
            "addEvidenceButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                `evidence.html?skill=${encodeURIComponent(skillName)}`;
        }
    );
}


// =====================================================
// INITIALIZE
// =====================================================

async function initializeSkillLearning() {

    currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }


    const skillName =
        getSelectedSkill();


    await loadUserSkills();
    await loadLearningProgress();

    renderHeader(
        skillName
    );

    renderPrerequisites(
        skillName
    );

    renderCurriculum(
        skillName
    );

    updateProgressUI(
        skillName
    );

    setupResources(
        skillName
    );

    setupPractice(
        skillName
    );

    setupAssessment(
        skillName
    );

    setupProject(
        skillName
    );

    setupEvidence(
        skillName
    );


    console.log(
        "WorkforceIQ Skill Learning loaded:",
        skillName
    );
}


document.addEventListener(
    "DOMContentLoaded",
    initializeSkillLearning
);