// =====================================================
// WORKFORCEIQ - LEARNING CENTER
// Backend Connected Version
// =====================================================

const API_URL = "http://localhost:8080/api";


// =====================================================
// GLOBAL DATA
// =====================================================

let loggedInUser = null;
let profile = null;
let skills = [];
let evidence = [];
let learningProgress = [];
let learningStudySessions = [];
// =====================================================
// LOAD STUDY SESSIONS FROM BACKEND
// =====================================================

async function loadStudySessions() {

    if (!loggedInUser || !loggedInUser.id) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/study-sessions/user/${loggedInUser.id}`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load study sessions"
            );
        }

        const backendSessions =
            await response.json();

        learningStudySessions =
            Array.isArray(backendSessions)
                ? backendSessions
                : [];

        console.log(
            "Study sessions loaded from MySQL:",
            learningStudySessions
        );

    } catch (error) {

        console.error(
            "Study sessions backend error:",
            error
        );

        learningStudySessions = [];
    }
}

// =====================================================
// CAREER SKILLS
// Keep these names SAME as skills.js/dashboard.js
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
        "Networking"
    ],

    "Docker": [
        "Linux"
    ],

    "Kubernetes": [
        "Docker"
    ]
};


// =====================================================
// ESTIMATED LEARNING TIME
// Prototype estimates in hours
// =====================================================

const learningTime = {

    "Java Fundamentals": 30,
    "OOP": 18,
    "Data Structures": 45,
    "SQL": 20,
    "REST API": 18,
    "Spring Boot": 30,
    "Git": 8,

    "HTML": 15,
    "CSS": 20,
    "JavaScript": 35,
    "React": 30,

    "Python": 30,
    "Statistics": 20,
    "Excel": 15,
    "Data Visualization": 20,
    "Power BI": 20,

    "Linux": 15,
    "Networking": 20,
    "AWS": 35,
    "Docker": 12,
    "Kubernetes": 25
};


// =====================================================
// AUTH
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
// LOAD PROFILE FROM BACKEND
// =====================================================

async function loadProfile() {

    loggedInUser =
        getLoggedInUser();


    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/${loggedInUser.id}`
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

        console.error(
            "Profile backend error:",
            error
        );


        // Fallback
        try {

            profile =
                JSON.parse(
                    localStorage.getItem(
                        "workforceProfile"
                    )
                );

        } catch {

            profile = null;
        }


        if (!profile) {

            window.location.href =
                "profile.html";

            return false;
        }


        return true;
    }
}


// =====================================================
// LOAD USER SKILLS FROM BACKEND
// =====================================================

async function loadSkills() {

    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/user-skills/user/${loggedInUser.id}`
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load skills"
            );
        }


        const backendSkills =
            await response.json();


        skills =
            Array.isArray(
                backendSkills
            )
                ? backendSkills
                : [];


        // Keep localStorage synchronized
        localStorage.setItem(
            "workforceSkills",
            JSON.stringify(
                skills.map(skill => ({
                    id:
                        skill.id,

                    name:
                        skill.skillName,

                    confidence:
                        skill.confidence
                }))
            )
        );


    } catch (error) {

        console.error(
            "Skills backend error:",
            error
        );


        const localSkills =
            JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];


        skills =
            localSkills.map(skill => ({
                id:
                    skill.id,

                skillName:
                    skill.name,

                confidence:
                    skill.confidence
            }));
    }
}


// =====================================================
// LOAD EVIDENCE
// =====================================================

async function loadEvidence() {

    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/evidence/user/${loggedInUser.id}`
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load evidence"
            );
        }


        const backendEvidence =
            await response.json();


        evidence =
            Array.isArray(
                backendEvidence
            )
                ? backendEvidence
                : [];


        localStorage.setItem(
            "workforceEvidence",
            JSON.stringify(
                evidence
            )
        );


    } catch (error) {

        console.error(
            "Evidence backend error:",
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
// LOAD LEARNING PROGRESS FROM BACKEND
// =====================================================

async function loadLearningProgress() {

    if (!loggedInUser || !loggedInUser.id) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/learning-progress/user/${loggedInUser.id}`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load learning progress"
            );
        }

        const backendProgress =
            await response.json();

        learningProgress =
            Array.isArray(backendProgress)
                ? backendProgress
                : [];

        const localProgress = {};

        learningProgress.forEach(item => {

            if (!localProgress[item.skillName]) {
                localProgress[item.skillName] = {};
            }

            localProgress[item.skillName][item.topicName] = {
                progress: item.progress,
                completed: item.completed,
                completedAt: item.updatedAt
            };

        });

        localStorage.setItem(
            "workforceTopicProgress",
            JSON.stringify(localProgress)
        );

        console.log(
            "Learning progress loaded from MySQL:",
            learningProgress
        );

    } catch (error) {

        console.error(
            "Learning progress backend error:",
            error
        );
    }
}

// =====================================================
// GET USER SKILL
// =====================================================

function getUserSkill(skillName) {

    return skills.find(
        skill => {

            const name =
                skill.skillName ||
                skill.name ||
                "";

            return (
                name.toLowerCase() ===
                skillName.toLowerCase()
            );
        }
    );
}


// =====================================================
// GET CONFIDENCE
// =====================================================

function getConfidence(skillName) {

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
// COMPLETION
// =====================================================

function isCompleted(skillName) {

    return (
        getConfidence(skillName) >= 80
    );
}


// =====================================================
// PREREQUISITES
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
            isCompleted(
                prerequisite
            )
    );
}


// =====================================================
// FIND NEXT SKILL
// =====================================================

function getNextSkill() {

    if (!profile) {
        return null;
    }


    const requiredSkills =
        careerSkills[
            profile.career
        ] || [];


    for (
        const skill of requiredSkills
    ) {

        if (
            !isCompleted(skill) &&
            prerequisitesCompleted(
                skill
            )
        ) {

            return skill;
        }
    }


    return null;
}


// =====================================================
// INCOMPLETE SKILLS
// =====================================================

function getLearningSkills() {

    if (!profile) {
        return [];
    }


    const requiredSkills =
        careerSkills[
            profile.career
        ] || [];


    return requiredSkills.filter(
        skill =>
            !isCompleted(skill)
    );
}


// =====================================================
// STUDY HOURS
// =====================================================

function getDailyStudyHours() {

    const hours =
        Number(
            profile?.studyHours
        );


    if (
        Number.isFinite(hours) &&
        hours > 0
    ) {

        return hours;
    }


    return 2;
}


// =====================================================
// STUDY DAYS
// =====================================================

function getStudyDays() {

    const days =
        Number(
            profile?.studyDays
        );


    if (
        Number.isFinite(days) &&
        days > 0
    ) {

        return days;
    }


    return 6;
}


// =====================================================
// WEEKLY STUDY HOURS
// =====================================================

function getWeeklyStudyHours() {

    return (
        getDailyStudyHours() *
        getStudyDays()
    );
}


// =====================================================
// ESTIMATED WEEKS
// =====================================================

function calculateWeeks(
    totalHours
) {

    const weeklyHours =
        getWeeklyStudyHours();


    if (
        weeklyHours <= 0 ||
        totalHours <= 0
    ) {

        return 0;
    }


    return Math.ceil(
        totalHours /
        weeklyHours
    );
}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(hours) {

    if (hours <= 0) {
        return "0 hrs";
    }


    if (hours < 1) {

        return (
            Math.round(
                hours * 60
            ) +
            " min"
        );
    }


    return (
        Math.round(hours) +
        " hrs"
    );
}


// =====================================================
// USER HEADER
// =====================================================

function loadUser() {

    const userCircle =
        document.getElementById(
            "userCircle"
        );


    if (
        userCircle &&
        profile &&
        profile.name
    ) {

        userCircle.textContent =
            profile.name
                .charAt(0)
                .toUpperCase();
    }
}


// =====================================================
// CAREER HEADER
// =====================================================

function loadCareer() {

    const description =
        document.getElementById(
            "careerDescription"
        );


    if (
        description &&
        profile
    ) {

        description.textContent =
            `Personalized learning path for ${profile.career}.`;
    }
}


// =====================================================
// SUMMARY
// =====================================================

function loadSummary() {

    if (!profile) {
        return;
    }


    const requiredSkills =
        careerSkills[
            profile.career
        ] || [];


    const incompleteSkills =
        getLearningSkills();


    // Remaining learning hours
    let remainingHours = 0;


    incompleteSkills.forEach(
        skill => {

            remainingHours +=
                learningTime[
                    skill
                ] || 0;
        }
    );


    // Completed weighted hours
    let completedHours = 0;


    requiredSkills.forEach(
        skill => {

            const confidence =
                getConfidence(skill);


            const hours =
                learningTime[
                    skill
                ] || 0;


            completedHours +=
                hours *
                Math.min(
                    confidence / 100,
                    1
                );
        }
    );


    const totalCareerHours =
        requiredSkills.reduce(
            (
                total,
                skill
            ) =>
                total +
                (
                    learningTime[
                        skill
                    ] || 0
                ),
            0
        );


    const progress =
        totalCareerHours === 0
            ? 0
            : Math.round(
                (
                    completedHours /
                    totalCareerHours
                ) * 100
            );


    const dailyHours =
        getDailyStudyHours();


    const studyDays =
        getStudyDays();


    const weeklyHours =
        dailyHours *
        studyDays;


    const estimatedWeeks =
        calculateWeeks(
            remainingHours
        );


    // ---------------------------------------------
    // UI
    // ---------------------------------------------

    const progressElement =
        document.getElementById(
            "learningProgress"
        );


    if (progressElement) {

        progressElement.textContent =
            progress + "%";
    }


    const remainingElement =
        document.getElementById(
            "skillsRemaining"
        );


    if (remainingElement) {

        remainingElement.textContent =
            incompleteSkills.length;
    }


    const estimatedElement =
        document.getElementById(
            "estimatedTime"
        );


    if (estimatedElement) {

        estimatedElement.textContent =
            remainingHours > 0
                ? `${estimatedWeeks} weeks`
                : "Completed";
    }


    const studyTimeElement =
        document.getElementById(
            "studyTime"
        );


    if (studyTimeElement) {

        studyTimeElement.textContent =
            `${dailyHours} hrs/day`;
    }


    localStorage.setItem(
        "workforceLearningSummary",
        JSON.stringify({

            progress,

            remainingHours,

            dailyHours,

            studyDays,

            weeklyHours,

            estimatedWeeks

        })
    );
}


// =====================================================
// LEARNING PATH
// =====================================================

function loadLearningPath() {

    const container =
        document.getElementById(
            "learningPath"
        );


    if (!container) {
        return;
    }


    const requiredSkills =
        careerSkills[
            profile?.career
        ] || [];


    if (
        requiredSkills.length === 0
    ) {

        container.innerHTML = `
            <div class="loading-state">
                <h3>
                    No learning path available
                </h3>

                <p>
                    Please select a supported career.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    requiredSkills.forEach(
        (
            skill,
            index
        ) => {

            const confidence =
                getConfidence(skill);


            const completed =
                confidence >= 80;


            const unlocked =
                prerequisitesCompleted(
                    skill
                );


            let status =
                "locked";


            let statusText =
                "LOCKED";


            if (completed) {

                status =
                    "completed";

                statusText =
                    "COMPLETED";

            } else if (unlocked) {

                status =
                    "current";

                statusText =
                    "LEARN NEXT";
            }


            const estimatedHours =
                learningTime[
                    skill
                ] || 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "learning-path-item";


            item.innerHTML = `

                <div class="path-number">

                    ${
                        completed
                            ? "✓"
                            : index + 1
                    }

                </div>


                <div class="path-content">

                    <h3>
                        ${skill}
                    </h3>


                    <p>
                        Current confidence:
                        ${confidence}%
                    </p>


                    <div class="path-time">
                        ⏱ Estimated learning time:
                        ${estimatedHours} hours
                    </div>

                </div>


                <span
                    class="path-status ${status}"
                >
                    ${statusText}
                </span>


                ${
                    unlocked
                        ? `
                            <a
                                href="skill-detail.html?skill=${encodeURIComponent(skill)}"
                                class="path-button"
                            >
                                View →
                            </a>
                        `
                        : ""
                }

            `;


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// CONTINUE LEARNING
// =====================================================

function loadContinueLearning() {

    const nextSkill =
        getNextSkill();


    const skillElement =
        document.getElementById(
            "continueSkill"
        );


    const descriptionElement =
        document.getElementById(
            "continueDescription"
        );


    const progressText =
        document.getElementById(
            "continueProgressText"
        );


    const progressBar =
        document.getElementById(
            "continueProgress"
        );


    const button =
        document.getElementById(
            "continueButton"
        );


    if (!nextSkill) {

        if (skillElement) {

            skillElement.textContent =
                "🎉 Career Path Completed!";
        }


        if (descriptionElement) {

            descriptionElement.textContent =
                "All required skills have reached the strong confidence level.";
        }


        if (progressText) {

            progressText.textContent =
                "100%";
        }


        if (progressBar) {

            progressBar.style.width =
                "100%";
        }


        return;
    }


    const confidence =
        getConfidence(
            nextSkill
        );


    if (skillElement) {

        skillElement.textContent =
            nextSkill;
    }


    if (descriptionElement) {

        descriptionElement.textContent =
            `WorkforceIQ recommends ${nextSkill} as your next learning focus based on your current skills and prerequisites.`;
    }


    if (progressText) {

        progressText.textContent =
            confidence + "%";
    }


    if (progressBar) {

        progressBar.style.width =
            confidence + "%";
    }


    if (button) {

        button.href =
            `skill-learning.html?skill=${encodeURIComponent(nextSkill)}`;

        button.textContent =
            "Start Learning →";
    }
}


// =====================================================
// TODAY'S PLAN
// =====================================================

function loadTodayPlan() {

    const nextSkill =
        getNextSkill();


    const title =
        document.getElementById(
            "todayTitle"
        );


    const description =
        document.getElementById(
            "todayDescription"
        );


    const time =
        document.getElementById(
            "todayTime"
        );


    const type =
        document.getElementById(
            "todayType"
        );


    const dailyHours =
        getDailyStudyHours();


    if (!nextSkill) {

        if (title) {

            title.textContent =
                "Review your completed skills";
        }


        if (description) {

            description.textContent =
                "Keep practicing your strongest skills and add recent evidence to maintain your confidence.";
        }


        if (time) {

            time.textContent =
                "⏱ 30 minutes";
        }


        if (type) {

            type.textContent =
                "🔄 Review";
        }


        return;
    }


    if (title) {

        title.textContent =
            `Learn ${nextSkill} fundamentals`;
    }


    if (description) {

        description.textContent =
            `Start with the fundamentals of ${nextSkill}, then practice what you learned.`;
    }


    if (time) {

        time.textContent =
            `⏱ ${dailyHours} hour(s)`;
    }


    if (type) {

        type.textContent =
            "📖 Learn + Practice";
    }
}


// =====================================================
// INSIGHT
// =====================================================

function loadInsight() {

    const nextSkill =
        getNextSkill();


    const title =
        document.getElementById(
            "learningInsightTitle"
        );


    const message =
        document.getElementById(
            "learningInsight"
        );


    if (
        !title ||
        !message
    ) {
        return;
    }


    const dailyHours =
        getDailyStudyHours();


    const studyDays =
        getStudyDays();


    const weeklyHours =
        getWeeklyStudyHours();


    if (!nextSkill) {

        title.textContent =
            "Career path completed";


        message.textContent =
            `All tracked skills have reached strong confidence. Continue practicing and collecting recent evidence. Your current study schedule is ${dailyHours} hours/day for ${studyDays} days/week (${weeklyHours} hours/week).`;

        return;
    }


    const prerequisiteList =
        prerequisites[
            nextSkill
        ] || [];


    if (
        prerequisiteList.length > 0
    ) {

        title.textContent =
            `${nextSkill} is your next focus`;


        message.textContent =
            `You have the required foundation for ${nextSkill}. Focus on this skill before progressing to the next stage of your roadmap.`;

    } else {

        title.textContent =
            `${nextSkill} is ready to learn`;


        message.textContent =
            `This skill has no tracked prerequisites, so you can start learning it now.`;
    }
}


// =====================================================
// LEARNING ANALYTICS
// =====================================================

function loadAnalytics() {

    // =========================================
    // COMPLETED TOPICS FROM MYSQL
    // =========================================

    const completedTopics =
        learningProgress.filter(
            item =>
                item &&
                (
                    item.completed === true ||
                    item.completed === 1
                )
        ).length;


    const topicsCompleted =
        document.getElementById(
            "topicsCompleted"
        );

    if (topicsCompleted) {

        topicsCompleted.textContent =
            completedTopics;

    }


    // =========================================
    // COMPLETED SKILLS
    // =========================================

    const skillsCompleted =
        document.getElementById(
            "skillsCompleted"
        );

    const completedSkills =
        (careerSkills[profile?.career] || [])
            .filter(
                skill =>
                    isCompleted(skill)
            )
            .length;

    if (skillsCompleted) {

        skillsCompleted.textContent =
            completedSkills;

    }


    // =========================================
    // STUDY TIME
    // =========================================

    const studySessions =
    Array.isArray(learningStudySessions)
        ? learningStudySessions
        : [];


const totalSeconds =
    studySessions.reduce(
        (
            total,
            session
        ) =>
            total +
            (
                Number(
                    session.duration
                ) || 0
            ),
        0
    );

const totalMinutes =
    totalSeconds / 60;


    const analyticsStudyTime =
        document.getElementById(
            "analyticsStudyTime"
        );

    if (analyticsStudyTime) {

        analyticsStudyTime.textContent =
            formatTime(
                totalMinutes / 60
            );

    }


    // =========================================
    // LEARNING STREAK
    // =========================================

    const streak =
        calculateStudyStreak(
            studySessions
        );


    const streakElement =
        document.getElementById(
            "learningStreak"
        );

    if (streakElement) {

        streakElement.textContent =
            streak;

    }
}


// =====================================================
// STUDY STREAK
// =====================================================

function calculateStudyStreak(
    sessions
) {

    if (
        !Array.isArray(sessions) ||
        sessions.length === 0
    ) {

        return 0;
    }


    const dates =
        new Set();


    sessions.forEach(
        session => {

            if (!session.sessionDate) {
                return;
            }


            const date =
                new Date(
                    session.sessionDate
                )
                .toISOString()
                .split("T")[0];


            dates.add(date);
        }
    );


    let current =
        new Date();


    let streak = 0;


    while (true) {

        const date =
            current
                .toISOString()
                .split("T")[0];


        if (
            dates.has(date)
        ) {

            streak++;

            current.setDate(
                current.getDate() - 1
            );

        } else {

            break;
        }
    }


    return streak;
}


// =====================================================
// SKILL STUDY LIST
// =====================================================

function loadSkillStudyList() {

    const container =
        document.getElementById(
            "skillStudyList"
        );


    if (!container) {
        return;
    }


    const requiredSkills =
        careerSkills[
            profile?.career
        ] || [];


    container.innerHTML = "";


    requiredSkills.forEach(
        skill => {

            const confidence =
                getConfidence(skill);


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "skill-study-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${skill}
                    </strong>

                    <span>
                        ${confidence}%
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${confidence}%"
                    ></div>

                </div>

            `;


            container.appendChild(
                item
            );
        }
    );
}


// =====================================================
// WEEKLY CHART
// =====================================================

function loadWeeklyChart() {

    const canvas =
        document.getElementById(
            "weeklyStudyChart"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


  const sessions =
    Array.isArray(learningStudySessions)
        ? learningStudySessions
        : [];


    const labels = [];
    const values = [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const key =
            date
                .toISOString()
                .split("T")[0];


        labels.push(
            date.toLocaleDateString(
                undefined,
                {
                    weekday: "short"
                }
            )
        );


        const minutes =
            sessions
                .filter(
                    session =>
                       session.sessionDate &&
new Date(session.sessionDate)
    .toISOString()
    .split("T")[0] === key
                )
                .reduce(
                    (
                        total,
                        session
                    ) =>
                        total +
                        (
                            Number(
                                session.duration
                            ) || 0
                        ),
                    0
                );


        values.push(
            Math.round(
                minutes / 60 * 10
            ) / 10
        );
    }


    if (
        window.workforceWeeklyChart
    ) {

        window.workforceWeeklyChart.destroy();
    }


    window.workforceWeeklyChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels,

                    datasets: [
                        {
                            label:
                                "Study Hours",

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
                            beginAtZero:
                                true
                        }
                    }
                }
            }
        );
}


// =====================================================
// SET BUTTONS
// =====================================================

function setupButtons() {

    const nextSkill =
        getNextSkill();


    const continueButton =
        document.getElementById(
            "continueButton"
        );


    if (
        continueButton &&
        nextSkill
    ) {

        continueButton.href =
            `skill-learning.html?skill=${encodeURIComponent(nextSkill)}`;
    }
}


// =====================================================
// MAIN INITIALIZATION
// =====================================================

async function initializeLearning() {

    const authenticated =
        await loadProfile();


    if (!authenticated) {
        return;
    }


await loadSkills();
await loadEvidence();
await loadLearningProgress();
await loadStudySessions();

loadUser();
    loadCareer();

    loadSummary();

    loadLearningPath();

    loadContinueLearning();

    loadTodayPlan();

    loadInsight();

    loadAnalytics();

    loadSkillStudyList();

    loadWeeklyChart();

    setupButtons();
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeLearning
);