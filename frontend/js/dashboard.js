// =====================================================
// WORKFORCEIQ - DASHBOARD
// Backend Connected - Final Version
// =====================================================

const API_URL = window.API_URL || "http://localhost:8080/api";

let currentUser = null;
let profile = null;
let userSkills = [];
let evidence = [];
let performanceSummary = null;


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

        // Map skill fields
        userSkills = userSkills.map(skill => ({
            id: skill.id,
            skillName: skill.skillName,
            confidence: Number(skill.confidence) || 0,
            performanceScore: skill.performanceScore !== null && skill.performanceScore !== undefined
                ? Number(skill.performanceScore) : null,
            evidenceStrength: skill.evidenceStrength || "None",
            evidenceCount: Number(skill.evidenceCount) || 0,
            lastAssessedAt: skill.lastAssessedAt
        }));

        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                userSkills.map(
                    skill => ({
                        id: skill.id,
                        name: skill.skillName,
                        confidence: skill.confidence,
                        performanceScore: skill.performanceScore,
                        evidenceStrength: skill.evidenceStrength,
                        evidenceCount: skill.evidenceCount
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

    const requiredSkills = getRequiredSkills();
    const readiness = (performanceSummary && performanceSummary.readinessScore !== null)
        ? Math.round(performanceSummary.readinessScore)
        : calculateReadiness();

    const overallPerf = (performanceSummary && performanceSummary.overallPerformanceScore !== null)
        ? Math.round(performanceSummary.overallPerformanceScore) + "%"
        : "--%";

    let strong = 0;
    let developing = 0;
    let missing = 0;

    requiredSkills.forEach(skillName => {
        const skill = getUserSkill(skillName);
        if (skill && skill.performanceScore !== null && skill.performanceScore >= 80) {
            strong++;
        } else if (skill && skill.performanceScore !== null && skill.performanceScore > 0) {
            developing++;
        } else {
            missing++;
        }
    });

    setText("overallPerformanceScore", overallPerf);
    setText("readinessScore", readiness + "%");
    setText("skillsCount", userSkills.length);
    setText("evidenceCount", evidence.length);
    setText("strongCount", strong);
    setText("developingCount", developing);
    setText("missingCount", missing);
}


// =====================================================
// DETAILED SKILL GAP
// =====================================================

function renderSkillGap() {

    const container = document.getElementById("detailedGap");
    if (!container) return;

    const requiredSkills = getRequiredSkills();
    container.innerHTML = "";

    requiredSkills.forEach(skillName => {
        const skill = getUserSkill(skillName);
        const hasEvidence = skill && skill.performanceScore !== null && (skill.evidenceCount || 0) > 0;
        const confidence = hasEvidence ? Math.round(skill.performanceScore) : 0;
        const strength = skill ? (skill.evidenceStrength || "None") : "None";
        let status = "Missing";

        if (confidence >= 80) {
            status = "Strong";
        } else if (hasEvidence && confidence > 0) {
            status = "Developing";
        }

        const item = document.createElement("div");
        item.className = "gap-item";
        item.style.transition = "all 0.2s ease";
        item.onclick = () => openBreakdownModal(skillName);

        const scoreText = hasEvidence ? `${confidence}%` : `Not assessed`;

        item.innerHTML = `
            <div>
                <strong>${escapeHTML(skillName)}</strong>
                <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px;">
                    <span class="skill-status status-${status.toLowerCase()}">${status}</span>
                    <span class="strength-badge strength-${strength.toLowerCase()}" style="font-size: 10px; padding: 1px 6px;">
                        Evidence: ${strength}
                    </span>
                </div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; justify-content: flex-end;">
                <span class="skill-row-score" style="font-size: 16px; font-weight: 700; color: #4338ca;">${scoreText}</span>
            </div>
        `;

        container.appendChild(item);
    });
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

    try {
        const sumRes = await fetch(`${API_URL}/user-skills/user/${currentUser.id}/performance-summary`);
        if (sumRes.ok) {
            performanceSummary = await sumRes.json();
        }
    } catch (e) {
        console.warn("Performance summary fetch error:", e);
    }

    renderUserInfo();
    renderSummary();
    renderSkillGap();
    renderNextSkill();
    renderRecommendedLearning();
    renderRecentEvidence();
    renderRadar();
    setupDashboardButtons();
}

/* =====================================================
   SCORE BREAKDOWN MODAL IN DASHBOARD
===================================================== */
window.openBreakdownModal = async function (skillName) {
    const modal = document.getElementById("breakdownModal");
    if (!modal) return;

    const nameEl = document.getElementById("modalSkillName");
    const strengthEl = document.getElementById("modalStrengthBadge");
    const scoreEl = document.getElementById("modalPerformanceScore");
    const statusEl = document.getElementById("modalStatusLabel");
    const formulaEl = document.getElementById("modalFormulaExplanation");
    const categoriesList = document.getElementById("modalCategoriesList");
    const missingBox = document.getElementById("modalMissingBox");
    const missingList = document.getElementById("modalMissingList");

    nameEl.textContent = skillName;
    scoreEl.textContent = "Loading...";
    formulaEl.textContent = "Calculating latest performance score from server...";
    categoriesList.innerHTML = "<p>Loading breakdown...</p>";

    modal.style.display = "flex";

    try {
        const response = await fetch(
            `${API_URL}/user-skills/user/${currentUser.id}/skill/${encodeURIComponent(skillName)}/breakdown`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch breakdown details.");
        }

        const data = await response.json();

        nameEl.textContent = data.skillName;
        strengthEl.textContent = `Evidence: ${data.evidenceStrength}`;
        strengthEl.className = `strength-badge strength-${data.evidenceStrength.toLowerCase()}`;

        if (data.performanceScore !== null) {
            scoreEl.textContent = `${data.performanceScore}%`;
        } else {
            scoreEl.textContent = "Not enough evidence yet";
        }

        statusEl.textContent = data.statusLabel || "Not Assessed";
        formulaEl.textContent = data.formulaExplanation || "No formula details available.";

        // Render categories
        categoriesList.innerHTML = "";
        (data.categories || []).forEach(function (cat) {
            const item = document.createElement("div");
            item.className = "category-item";

            const scoreText = cat.hasEvidence
                ? `<strong>${cat.score}%</strong>`
                : `<span class="category-missing">Missing (Not counted)</span>`;

            const effWeightText = cat.hasEvidence
                ? `(Effective weight: ${(cat.effectiveWeight * 100).toFixed(1)}%)`
                : `(Base weight: ${(cat.baseWeight * 100).toFixed(0)}%)`;

            const progressWidth = cat.hasEvidence ? cat.score : 0;

            item.innerHTML = `
                <div class="category-header">
                    <div>
                        <strong>${escapeHTML(cat.displayName)}</strong>
                        <small class="category-weight">${effWeightText} · ${cat.evidenceCount} records</small>
                    </div>
                    <div class="category-score-val">
                        ${scoreText}
                    </div>
                </div>
                <div class="category-progress-track">
                    <div class="category-progress-fill" style="width: ${progressWidth}%;"></div>
                </div>
            `;
            categoriesList.appendChild(item);
        });

        // Missing categories
        if (data.missingCategories && data.missingCategories.length > 0) {
            missingBox.style.display = "block";
            missingList.innerHTML = "";
            data.missingCategories.forEach(function (cat) {
                const li = document.createElement("li");
                li.textContent = cat;
                missingList.appendChild(li);
            });
        } else {
            missingBox.style.display = "none";
        }

    } catch (error) {
        console.error("Modal error:", error);
        formulaEl.textContent = "Error loading breakdown: " + error.message;
    }
};

window.closeBreakdownModal = function () {
    const modal = document.getElementById("breakdownModal");
    if (modal) {
        modal.style.display = "none";
    }
};

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        window.closeBreakdownModal();
    }
});


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);