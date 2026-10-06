// ==========================================
// WORKFORCEIQ - LEARNING PROGRESS ENGINE
// Backend + LocalStorage Sync
// ==========================================

const LEARNING_PROGRESS_API =
    "http://localhost:8080/api/learning-progress";

const TOPIC_PROGRESS_KEY =
    "workforceTopicProgress";

const LEARNING_PROGRESS_KEY =
    "workforceLearningProgress";

const STUDY_SESSIONS_KEY =
    "workforceStudySessions";


// ==========================================
// CURRENT USER
// ==========================================

function getLearningUserId() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "workforceLoggedInUser"
            )
        );

    if (!user || !user.id) {
        return null;
    }

    return Number(user.id);
}


// ==========================================
// LOCAL TOPIC PROGRESS
// ==========================================

function getTopicProgressData() {

    return (
        JSON.parse(
            localStorage.getItem(
                TOPIC_PROGRESS_KEY
            )
        ) || {}
    );

}


// ==========================================
// GET TOPIC PROGRESS
// ==========================================

function getTopicProgress(
    skillName,
    topicName
) {

    const progress =
        getTopicProgressData();

    if (
        progress[skillName] &&
        progress[skillName][topicName]
    ) {

        return progress
            [skillName]
            [topicName];

    }

    return {
        progress: 0,
        completed: false
    };

}


// ==========================================
// SAVE TOPIC PROGRESS
// ==========================================

async function saveTopicProgress(
    skillName,
    topicName,
    progressValue,
    completed = false
) {

    const progress =
        getTopicProgressData();


    if (!progress[skillName]) {

        progress[skillName] = {};

    }


    progress[skillName][topicName] = {

        progress:
            Number(progressValue) || 0,

        completed:
            Boolean(completed),

        completedAt:
            completed
                ? new Date().toISOString()
                : null

    };


    localStorage.setItem(
        TOPIC_PROGRESS_KEY,
        JSON.stringify(progress)
    );


    // --------------------------------------
    // BACKEND
    // --------------------------------------

    const userId =
        getLearningUserId();

    if (!userId) {
        return;
    }


    try {

        await fetch(
            LEARNING_PROGRESS_API,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    userId: userId,

                    skillName:
                        skillName,

                    topicName:
                        topicName,

                    progress:
                        Number(progressValue) || 0,

                    completed:
                        Boolean(completed)

                })

            }
        );

    }

    catch (error) {

        console.warn(
            "Learning progress backend sync failed:",
            error
        );

    }

}


// ==========================================
// LOAD BACKEND PROGRESS
// ==========================================

async function loadBackendLearningProgress() {

    const userId =
        getLearningUserId();

    if (!userId) {
        return [];
    }


    try {

        const response =
            await fetch(
                `${LEARNING_PROGRESS_API}/user/${userId}`
            );


        if (!response.ok) {
            return [];
        }


        const backendData =
            await response.json();


        if (!Array.isArray(backendData)) {
            return [];
        }


        const localProgress =
            getTopicProgressData();


        backendData.forEach(
            item => {

                if (!localProgress[item.skillName]) {

                    localProgress[item.skillName] =
                        {};

                }


                localProgress
                    [item.skillName]
                    [item.topicName] = {

                        progress:
                            Number(item.progress) || 0,

                        completed:
                            Boolean(item.completed),

                        completedAt:
                            item.updatedAt || null

                    };

            }
        );


        localStorage.setItem(
            TOPIC_PROGRESS_KEY,
            JSON.stringify(
                localProgress
            )
        );


        return backendData;

    }

    catch (error) {

        console.warn(
            "Could not load backend learning progress:",
            error
        );

        return [];

    }

}


// ==========================================
// CHECK TOPIC COMPLETED
// ==========================================

function isTopicCompleted(
    skillName,
    topicName
) {

    const data =
        getTopicProgress(
            skillName,
            topicName
        );

    return data.completed === true;

}


// ==========================================
// GET TOPIC PERCENTAGE
// ==========================================

function getTopicPercentage(
    skillName,
    topicName
) {

    const data =
        getTopicProgress(
            skillName,
            topicName
        );


    if (data.completed) {
        return 100;
    }


    return Number(
        data.progress
    ) || 0;

}


// ==========================================
// CALCULATE SKILL PROGRESS
// ==========================================

function calculateSkillProgress(
    skillName,
    topics
) {

    if (
        !topics ||
        topics.length === 0
    ) {

        return 0;

    }


    let total = 0;


    topics.forEach(
        topic => {

            total +=
                getTopicPercentage(
                    skillName,
                    topic
                );

        }
    );


    return Math.round(
        total / topics.length
    );

}


// ==========================================
// UPDATE SKILL PROGRESS
// ==========================================

function updateSkillProgress(
    skillName,
    topics
) {

    const percentage =
        calculateSkillProgress(
            skillName,
            topics
        );


    const allProgress =
        JSON.parse(
            localStorage.getItem(
                LEARNING_PROGRESS_KEY
            )
        ) || {};


    allProgress[skillName] = {

        progress:
            percentage,

        completed:
            percentage >= 100,

        updatedAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        LEARNING_PROGRESS_KEY,
        JSON.stringify(
            allProgress
        )
    );


    return percentage;

}


// ==========================================
// COMPLETED TOPIC COUNT
// ==========================================

function getCompletedTopicCount() {

    const progress =
        getTopicProgressData();


    let count = 0;


    Object.values(
        progress
    ).forEach(
        skillTopics => {

            Object.values(
                skillTopics
            ).forEach(
                topic => {

                    if (
                        topic &&
                        topic.completed
                    ) {

                        count++;

                    }

                }
            );

        }
    );


    return count;

}


// ==========================================
// TOTAL COMPLETED TOPICS
// ==========================================

function getTotalCompletedTopics() {

    return getCompletedTopicCount();

}


// ==========================================
// TOTAL TOPICS
// ==========================================

function getTotalTopics(
    learningData
) {

    if (!learningData) {
        return 0;
    }


    let count = 0;


    Object.values(
        learningData
    ).forEach(
        skill => {

            if (
                Array.isArray(skill)
            ) {

                count +=
                    skill.length;

            }

        }
    );


    return count;

}


// ==========================================
// OVERALL LEARNING PROGRESS
// ==========================================

function calculateOverallProgress(
    learningData
) {

    const totalTopics =
        getTotalTopics(
            learningData
        );


    if (totalTopics === 0) {
        return 0;
    }


    const completedTopics =
        getCompletedTopicCount();


    return Math.round(
        (
            completedTopics /
            totalTopics
        ) * 100
    );

}


// ==========================================
// COMPLETED SKILLS
// ==========================================

function getCompletedSkills(
    learningData
) {

    if (!learningData) {
        return [];
    }


    const completedSkills = [];


    Object.entries(
        learningData
    ).forEach(
        ([skillName, topics]) => {

            if (
                !Array.isArray(topics) ||
                topics.length === 0
            ) {

                return;

            }


            const completed =
                topics.every(
                    topic =>
                        isTopicCompleted(
                            skillName,
                            topic
                        )
                );


            if (completed) {

                completedSkills.push(
                    skillName
                );

            }

        }
    );


    return completedSkills;

}


// ==========================================
// STUDY SESSIONS
// ==========================================

function getStudySessions() {

    return (
        JSON.parse(
            localStorage.getItem(
                STUDY_SESSIONS_KEY
            )
        ) || []
    );

}


// ==========================================
// TOTAL STUDY MINUTES
// ==========================================

function getTotalStudyMinutes() {

    const sessions =
        getStudySessions();


    let totalSeconds = 0;


    sessions.forEach(
        session => {

            totalSeconds +=
                Number(
                    session.duration
                ) || 0;

        }
    );


    return Math.floor(
        totalSeconds / 60
    );

}


// ==========================================
// TODAY STUDY MINUTES
// ==========================================

function getTodayStudyMinutes() {

    const sessions =
        getStudySessions();


    const today =
        new Date()
            .toDateString();


    let totalSeconds = 0;


    sessions.forEach(
        session => {

            const date =
                new Date(
                    session.date
                );


            if (
                date.toDateString() ===
                today
            ) {

                totalSeconds +=
                    Number(
                        session.duration
                    ) || 0;

            }

        }
    );


    return Math.floor(
        totalSeconds / 60
    );

}


// ==========================================
// RECORD STUDY SESSION
// ==========================================

function recordStudySession(
    skillName,
    topicName,
    duration
) {

    const sessions =
        getStudySessions();


    sessions.push({

        id:
            Date.now(),

        skill:
            skillName,

        topic:
            topicName,

        duration:
            Number(duration) || 0,

        date:
            new Date().toISOString()

    });


    localStorage.setItem(
        STUDY_SESSIONS_KEY,
        JSON.stringify(
            sessions
        )
    );

}


// ==========================================
// SYNC EXISTING LOCAL DATA
// ==========================================

async function syncLocalProgressToBackend() {

    const userId =
        getLearningUserId();

    if (!userId) {
        return;
    }


    const progress =
        getTopicProgressData();


    for (
        const skillName
        of Object.keys(progress)
    ) {

        const topics =
            progress[skillName];


        for (
            const topicName
            of Object.keys(topics)
        ) {

            const topic =
                topics[topicName];


            try {

                await fetch(
                    LEARNING_PROGRESS_API,
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

                            topicName:

                                topicName,

                            progress:

                                topic.completed
                                    ? 100
                                    : Number(
                                        topic.progress
                                    ) || 0,

                            completed:

                                Boolean(
                                    topic.completed
                                )

                        })

                    }
                );

            }

            catch (error) {

                console.warn(
                    "Progress sync failed:",
                    error
                );

            }

        }

    }

}


// ==========================================
// INITIALIZE
// ==========================================

async function initializeLearningProgress() {

    await loadBackendLearningProgress();

    await syncLocalProgressToBackend();

}


// ==========================================
// GLOBAL API
// ==========================================

window.WorkforceLearning = {

    getTopicProgress,

    saveTopicProgress,

    loadBackendLearningProgress,

    isTopicCompleted,

    getTopicPercentage,

    calculateSkillProgress,

    updateSkillProgress,

    getCompletedTopicCount,

    getTotalCompletedTopics,

    getTotalTopics,

    calculateOverallProgress,

    getCompletedSkills,

    getTotalStudyMinutes,

    getTodayStudyMinutes,

    recordStudySession,

    syncLocalProgressToBackend,

    initializeLearningProgress

};


// ==========================================
// START BACKEND SYNC
// ==========================================

initializeLearningProgress();