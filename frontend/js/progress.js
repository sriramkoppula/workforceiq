// =====================================================
// WORKFORCEIQ - PROGRESS
// Backend Connected Version
// =====================================================

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let userProfile = null;
let userSkills = [];
let progressHistory = [];
let progressChart = null;


// =====================================================
// USER
// =====================================================

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem("workforceLoggedInUser")
        );

    } catch (error) {

        return null;
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
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    currentUser = getCurrentUser();

    if (!currentUser || !currentUser.id) {

        window.location.href = "login.html";

        return false;
    }

    try {

        const response = await fetch(
            `${API_URL}/users/${currentUser.id}`
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load profile"
            );
        }

        userProfile = await response.json();

        localStorage.setItem(
            "workforceProfile",
            JSON.stringify(userProfile)
        );

        return true;

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        try {

            userProfile = JSON.parse(
                localStorage.getItem(
                    "workforceProfile"
                )
            ) || null;

        } catch {

            userProfile = null;
        }

        return !!userProfile;
    }
}


// =====================================================
// LOAD SKILLS
// =====================================================

async function loadSkills() {

    try {

        const response = await fetch(
            `${API_URL}/user-skills/user/${currentUser.id}`
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load skills"
            );
        }

        userSkills = await response.json();

        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                userSkills.map(skill => ({
                    id: skill.id,
                    name: skill.skillName,
                    confidence: skill.confidence
                }))
            )
        );

    } catch (error) {

        console.error(
            "Skills loading error:",
            error
        );

        try {

            const local = JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];

            userSkills = local.map(skill => ({
                id: skill.id,
                skillName: skill.name,
                confidence: skill.confidence
            }));

        } catch {

            userSkills = [];
        }
    }
}


// =====================================================
// LOAD PROGRESS HISTORY
// =====================================================

async function loadHistory() {

    try {

        const response = await fetch(
            `${API_URL}/progress/user/${currentUser.id}`
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load progress history"
            );
        }

        progressHistory = await response.json();

        if (!Array.isArray(progressHistory)) {

            progressHistory = [];
        }

        // Backend already returns oldest → newest
        progressHistory.sort(
            (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
        );

        localStorage.setItem(
            "workforceProgressHistory",
            JSON.stringify(progressHistory)
        );

    } catch (error) {

        console.error(
            "Progress history loading error:",
            error
        );

        try {

            progressHistory = JSON.parse(
                localStorage.getItem(
                    "workforceProgressHistory"
                )
            ) || [];

        } catch {

            progressHistory = [];
        }
    }
}


// =====================================================
// CALCULATE READINESS
// =====================================================

function calculateReadiness() {

    const requiredSkills =
        careerSkills[userProfile?.career] || [];

    if (requiredSkills.length === 0) {

        return 0;
    }

    let total = 0;

    requiredSkills.forEach(skillName => {

        const skill = userSkills.find(item => {

            const name =
                item.skillName ||
                item.name ||
                "";

            return name.toLowerCase() ===
                skillName.toLowerCase();
        });

        total += skill
            ? Number(skill.confidence) || 0
            : 0;
    });

    return Math.round(
        total / requiredSkills.length
    );
}


// =====================================================
// CHECK TODAY'S RECORD
// =====================================================

function hasProgressForToday() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    return progressHistory.some(item => {

        if (!item.createdAt) {

            return false;
        }

        return item.createdAt.startsWith(today);
    });
}


// =====================================================
// SAVE CURRENT PROGRESS
// =====================================================

async function saveCurrentProgress(readiness) {

    if (!currentUser || !currentUser.id) {

        return;
    }

    // Do not create multiple records on the same day
    if (hasProgressForToday()) {

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/progress`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    userId:
                        currentUser.id,

                    readinessScore:
                        readiness
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to save progress"
            );
        }

        const saved =
            await response.json();

        progressHistory.push(saved);

        progressHistory.sort(
            (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
        );

        localStorage.setItem(
            "workforceProgressHistory",
            JSON.stringify(progressHistory)
        );

    } catch (error) {

        console.error(
            "Save progress error:",
            error
        );
    }
}


// =====================================================
// UPDATE CAREER TEXT
// =====================================================

function updateCareerText() {

    const element =
        document.getElementById(
            "careerText"
        );

    if (!element) {

        return;
    }

    if (userProfile?.career) {

        element.textContent =
            `Track your ${userProfile.career} career readiness changes over time.`;

    } else {

        element.textContent =
            "Track how your career readiness changes over time.";
    }
}


// =====================================================
// UPDATE CURRENT READINESS
// =====================================================

function updateReadiness(readiness) {

    const currentElement =
        document.getElementById(
            "currentReadiness"
        );

    if (currentElement) {

        currentElement.textContent =
            readiness + "%";
    }


    // Current score card

    const currentScore =
        document.getElementById(
            "currentScore"
        );

    if (currentScore) {

        currentScore.textContent =
            readiness + "%";
    }


    // Circle

    const circleValue =
        document.getElementById(
            "circleValue"
        );

    if (circleValue) {

        circleValue.textContent =
            readiness + "%";
    }


    // Circle visual progress

    const circle =
        document.querySelector(
            ".progress-circle"
        );

    if (circle) {

        circle.style.setProperty(
            "--progress",
            readiness
        );
    }


    // Message

    const message =
        document.getElementById(
            "progressMessage"
        );

    if (message) {

        if (readiness >= 80) {

            message.textContent =
                "You are building strong career readiness.";

        } else if (readiness >= 60) {

            message.textContent =
                "You are making good progress. Keep building your skills.";

        } else if (readiness >= 40) {

            message.textContent =
                "Keep learning and strengthening your skills.";

        } else {

            message.textContent =
                "Start building your core career skills.";
        }
    }
}


// =====================================================
// STARTING READINESS
// =====================================================

function getStartingReadiness() {

    if (
        !progressHistory ||
        progressHistory.length === 0
    ) {

        return 0;
    }

    return Number(
        progressHistory[0].readinessScore
    ) || 0;
}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(current) {

    const starting =
        getStartingReadiness();

    const improvement =
        current - starting;


    // Starting

    const startingElement =
        document.getElementById(
            "startingScore"
        );

    if (startingElement) {

        startingElement.textContent =
            starting + "%";
    }


    // Current

    const currentElement =
        document.getElementById(
            "currentScore"
        );

    if (currentElement) {

        currentElement.textContent =
            current + "%";
    }


    // Improvement

    const improvementElement =
        document.getElementById(
            "improvementScore"
        );

    if (improvementElement) {

        improvementElement.textContent =
            (improvement >= 0 ? "+" : "") +
            improvement +
            "%";
    }
}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistoryList() {

    const container =
        document.getElementById(
            "historyList"
        );

    if (!container) {

        console.error(
            "historyList element not found"
        );

        return;
    }


    if (
        !progressHistory ||
        progressHistory.length === 0
    ) {

        container.innerHTML = `
            <div class="history-empty">
                <p>No progress history yet.</p>
            </div>
        `;

        return;
    }


    // Newest first

    const history =
        [...progressHistory]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );


    container.innerHTML =
        history.map(item => {

            const date =
                item.createdAt
                    ? new Date(
                        item.createdAt
                    ).toLocaleDateString(
                        undefined,
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }
                    )
                    : "Unknown date";


            const score =
                Number(
                    item.readinessScore
                ) || 0;


            return `
                <div class="history-item">

                    <div class="history-date">
                        <strong>
                            ${date}
                        </strong>

                        <span>
                            Career readiness
                        </span>
                    </div>

                    <div class="history-score">
                        ${score}%
                    </div>

                </div>
            `;

        }).join("");
}


// =====================================================
// RENDER CHART
// =====================================================

function renderChart() {

    const canvas =
        document.getElementById(
            "progressChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }


    if (progressChart) {

        progressChart.destroy();
    }


    const labels =
        progressHistory.map(item => {

            if (!item.createdAt) {

                return "";
            }

            return new Date(
                item.createdAt
            ).toLocaleDateString(
                undefined,
                {
                    month: "short",
                    day: "numeric"
                }
            );
        });


    const values =
        progressHistory.map(item =>
            Number(
                item.readinessScore
            ) || 0
        );


    progressChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Readiness",

                            data:
                                values,

                            tension:
                                0.3,

                            fill:
                                false
                        }
                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            min: 0,

                            max: 100,

                            ticks: {

                                callback:
                                    value =>
                                        value + "%"
                            }
                        }
                    },


                    plugins: {

                        tooltip: {

                            callbacks: {

                                label:
                                    context =>
                                        `Readiness: ${context.parsed.y}%`
                            }
                        }
                    }
                }
            }
        );
}


// =====================================================
// MAIN
// =====================================================

async function initializeProgress() {

    console.log(
        "WorkforceIQ Progress loading..."
    );


    const authenticated =
        await loadProfile();

    if (!authenticated) {

        return;
    }


    await loadSkills();

    await loadHistory();


    const readiness =
        calculateReadiness();


    await saveCurrentProgress(
        readiness
    );


    updateCareerText();

    updateReadiness(
        readiness
    );

    updateStatistics(
        readiness
    );

    renderHistoryList();

    renderChart();


    console.log(
        "Progress history:",
        progressHistory
    );

    console.log(
        "Current readiness:",
        readiness
    );
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProgress
);