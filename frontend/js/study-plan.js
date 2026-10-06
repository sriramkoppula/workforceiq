/* =========================================
   WorkforceIQ Personalized Study Plan
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================
           STORAGE
        ====================================== */

        const profile =
            JSON.parse(
                localStorage.getItem(
                    "workforceProfile"
                )
            );

        const skills =
            JSON.parse(
                localStorage.getItem(
                    "workforceSkills"
                )
            ) || [];

        const topicProgress =
            JSON.parse(
                localStorage.getItem(
                    "workforceTopicProgress"
                )
            ) || {};

        const learningProgress =
            JSON.parse(
                localStorage.getItem(
                    "workforceLearningProgress"
                )
            ) || {};


        /* =====================================
           PROFILE CHECK
        ====================================== */

        if (!profile) {

            window.location.href =
                "profile.html";

            return;

        }


        /* =====================================
           CAREER SKILLS
        ====================================== */

        const careerSkills = {

            "Java Backend Developer": [
                "Java",
                "OOP",
                "DSA",
                "SQL",
                "DBMS",
                "Git",
                "REST API",
                "Spring Boot",
                "Docker",
                "AWS"
            ],

            "Frontend Developer": [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Git"
            ],

            "Data Analyst": [
                "Python",
                "SQL",
                "Excel",
                "Data Visualization"
            ],

            "Cloud Engineer": [
                "Linux",
                "Networking",
                "AWS",
                "Docker",
                "Git"
            ]

        };


        /* =====================================
           PREREQUISITES
        ====================================== */

        const prerequisites = {

            "Java": [],

            "OOP": [
                "Java"
            ],

            "DSA": [
                "Java"
            ],

            "SQL": [],

            "DBMS": [
                "SQL"
            ],

            "Git": [],

            "REST API": [
                "Java",
                "OOP"
            ],

            "Spring Boot": [
                "Java",
                "OOP",
                "REST API"
            ],

            "Docker": [],

            "AWS": [
                "Docker"
            ],

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

            "Excel": [],

            "Data Visualization": [
                "Python",
                "SQL"
            ],

            "Linux": [],

            "Networking": [
                "Linux"
            ]

        };


        /* =====================================
           TOPICS
        ====================================== */

        const skillTopics = {

            "Java": [
                "Java Fundamentals",
                "Variables and Data Types",
                "Control Flow"
            ],

            "OOP": [
                "Classes and Objects",
                "Inheritance",
                "Polymorphism",
                "Abstraction",
                "Encapsulation"
            ],

            "DSA": [
                "Arrays",
                "Linked Lists",
                "Stacks",
                "Queues",
                "Searching",
                "Sorting"
            ],

            "SQL": [
                "SQL Fundamentals",
                "SELECT Queries",
                "Filtering and Sorting",
                "Joins",
                "Aggregate Functions"
            ],

            "DBMS": [
                "DBMS Fundamentals",
                "Keys",
                "Normalization",
                "Transactions"
            ],

            "Git": [
                "Git Fundamentals",
                "Repositories",
                "Branches",
                "GitHub"
            ],

            "REST API": [
                "HTTP Fundamentals",
                "REST Principles",
                "API Requests",
                "API Responses"
            ],

            "Spring Boot": [
                "Spring Boot Fundamentals",
                "REST Controllers",
                "Dependency Injection",
                "Database Integration"
            ],

            "Docker": [
                "Docker Fundamentals",
                "Images and Containers",
                "Dockerfile",
                "Docker Compose"
            ],

            "AWS": [
                "Cloud Fundamentals",
                "AWS Core Services",
                "EC2",
                "S3"
            ],

            "HTML": [
                "HTML Fundamentals",
                "Semantic HTML",
                "Forms",
                "Tables"
            ],

            "CSS": [
                "CSS Fundamentals",
                "Selectors",
                "Flexbox",
                "Grid",
                "Responsive Design"
            ],

            "JavaScript": [
                "JavaScript Fundamentals",
                "Variables",
                "Functions",
                "Arrays and Objects",
                "DOM"
            ],

            "React": [
                "React Fundamentals",
                "Components",
                "Props and State",
                "Hooks"
            ],

            "Python": [
                "Python Fundamentals",
                "Variables and Data Types",
                "Control Flow",
                "Functions",
                "Lists and Dictionaries"
            ],

            "Excel": [
                "Excel Fundamentals",
                "Formulas",
                "Functions",
                "Charts",
                "Pivot Tables"
            ],

            "Data Visualization": [
                "Visualization Fundamentals",
                "Charts",
                "Dashboards",
                "Data Storytelling"
            ],

            "Linux": [
                "Linux Fundamentals",
                "File System",
                "Commands",
                "Permissions"
            ],

            "Networking": [
                "Networking Fundamentals",
                "IP Addressing",
                "Protocols",
                "DNS and HTTP"
            ]

        };


        const requiredSkills =
            careerSkills[
                profile.career
            ] || [];


        /* =====================================
           USER SETTINGS
        ====================================== */

        const dailyHours =
            Number(profile.studyHours) || 1;

        const studyDays =
            Number(profile.studyDays) || 3;

        const weeklyHours =
            dailyHours * studyDays;


        /* =====================================
           USER SKILL
        ====================================== */

        function getUserSkill(
            skillName
        ) {

            return skills.find(
                skill =>
                    skill.name.toLowerCase() ===
                    skillName.toLowerCase()
            );

        }


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


        /* =====================================
           PREREQUISITES
        ====================================== */

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


        /* =====================================
           NEXT SKILLS
        ====================================== */

        function getNextSkills() {

            const available = [];

            const locked = [];

            requiredSkills.forEach(
                skill => {

                    const confidence =
                        getConfidence(skill);

                    if (confidence >= 80) {
                        return;
                    }


                    if (
                        prerequisitesCompleted(
                            skill
                        )
                    ) {

                        available.push(
                            skill
                        );

                    }

                    else {

                        locked.push(
                            skill
                        );

                    }

                }
            );


            return {
                available,
                locked
            };

        }


        const nextSkills =
            getNextSkills();


        /* =====================================
           READINESS
        ====================================== */

        let total =
            0;


        requiredSkills.forEach(
            skill => {

                total +=
                    getConfidence(
                        skill
                    );

            }
        );


        const readiness =
            requiredSkills.length
                ? Math.round(
                    total /
                    requiredSkills.length
                )
                : 0;


        /* =====================================
           HEADER
        ====================================== */

        const careerName =
            document.getElementById(
                "careerName"
            );

        if (careerName) {

            careerName.textContent =
                profile.career;

        }


        const planDescription =
            document.getElementById(
                "planDescription"
            );

        if (planDescription) {

            planDescription.textContent =
                `Your personalized ${weeklyHours}-hour weekly plan is based on your ${profile.career} goal and current skill readiness.`;

        }


        /* =====================================
           SUMMARY
        ====================================== */

        const dailyHoursElement =
            document.getElementById(
                "dailyHours"
            );

        if (dailyHoursElement) {

            dailyHoursElement.textContent =
                `${dailyHours} ${
                    dailyHours === 1
                        ? "hr"
                        : "hrs"
                }`;

        }


        const studyDaysElement =
            document.getElementById(
                "studyDays"
            );

        if (studyDaysElement) {

            studyDaysElement.textContent =
                `${studyDays} ${
                    studyDays === 1
                        ? "day"
                        : "days"
                }`;

        }


        const weeklyHoursElement =
            document.getElementById(
                "weeklyHours"
            );

        if (weeklyHoursElement) {

            weeklyHoursElement.textContent =
                `${weeklyHours} hrs`;

        }


        const readinessElement =
            document.getElementById(
                "readiness"
            );

        if (readinessElement) {

            readinessElement.textContent =
                `${readiness}%`;

        }


        /* =====================================
           GET LEARNING TARGETS
        ====================================== */

        function getLearningTargets() {

            const targets = [];


            /*
             First prioritize skills whose
             prerequisites are completed.
            */

            nextSkills.available.forEach(
                skill => {

                    const topics =
                        skillTopics[
                            skill
                        ] || [];

                    topics.forEach(
                        topic => {

                            targets.push({

                                skill:
                                    skill,

                                topic:
                                    topic

                            });

                        }
                    );

                }
            );


            /*
             If no available skills,
             use the next required skills.
            */

            if (!targets.length) {

                requiredSkills.forEach(
                    skill => {

                        const topics =
                            skillTopics[
                                skill
                            ] || [];

                        topics.forEach(
                            topic => {

                                targets.push({

                                    skill:
                                        skill,

                                    topic:
                                        topic

                                });

                            }
                        );

                    }
                );

            }


            return targets;

        }


        const targets =
            getLearningTargets();


        /* =====================================
           TOPIC COMPLETION
        ====================================== */

        function isTopicCompleted(
            skill,
            topic
        ) {

            return Boolean(
                topicProgress
                    ?.[
                        skill
                    ]
                    ?.[
                        topic
                    ]
                    ?.completed
            );

        }


        function getFirstIncompleteTarget() {

            return targets.find(
                target =>
                    !isTopicCompleted(
                        target.skill,
                        target.topic
                    )
            );

        }


        const firstTarget =
            getFirstIncompleteTarget();


        /* =====================================
           TODAY PLAN
        ====================================== */

        const todayTitle =
            document.getElementById(
                "todayTitle"
            );

        const todayDescription =
            document.getElementById(
                "todayDescription"
            );

        const todayActivities =
            document.getElementById(
                "todayActivities"
            );


        if (firstTarget) {

            if (todayTitle) {

                todayTitle.textContent =
                    `${firstTarget.skill} — ${firstTarget.topic}`;

            }


            if (todayDescription) {

                todayDescription.textContent =
                    `Focus on this topic today. Complete the lesson, practice it, and record evidence when you are ready.`;

            }


            if (todayActivities) {

                todayActivities.innerHTML = `

                    <div class="today-activity">

                        <h3>
                            📖 Learn
                        </h3>

                        <p>
                            Study the core concepts of
                            ${firstTarget.topic}.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(45)}
                        </span>

                    </div>


                    <div class="today-activity">

                        <h3>
                            💻 Practice
                        </h3>

                        <p>
                            Solve problems related to
                            ${firstTarget.topic}.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(45)}
                        </span>

                    </div>


                    <div class="today-activity">

                        <h3>
                            🧠 Review
                        </h3>

                        <p>
                            Review what you learned and
                            test your understanding.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(30)}
                        </span>

                    </div>

                `;

            }

        }

        else {

            if (todayTitle) {

                todayTitle.textContent =
                    "Great work! 🎉";

            }


            if (todayDescription) {

                todayDescription.textContent =
                    "You have completed the current learning topics. Use today to practice and maintain your skills.";

            }


            if (todayActivities) {

                todayActivities.innerHTML = `

                    <div class="today-activity">

                        <h3>
                            💻 Practice
                        </h3>

                        <p>
                            Practice your strongest skills.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(60)}
                        </span>

                    </div>


                    <div class="today-activity">

                        <h3>
                            🧪 Assessment
                        </h3>

                        <p>
                            Test your knowledge.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(30)}
                        </span>

                    </div>


                    <div class="today-activity">

                        <h3>
                            🔄 Review
                        </h3>

                        <p>
                            Review older topics to prevent
                            skill decay.
                        </p>

                        <span class="activity-time">
                            ${getSessionTime(30)}
                        </span>

                    </div>

                `;

            }

        }


        /* =====================================
           WEEKLY PLAN
        ====================================== */

        createWeeklyPlan();


        function createWeeklyPlan() {

            const weeklyPlan =
                document.getElementById(
                    "weeklyPlan"
                );

            if (!weeklyPlan) {
                return;
            }


            const dayNames = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ];


            const activeDays =
                Math.min(
                    studyDays,
                    7
                );


            let targetIndex =
                0;


            weeklyPlan.innerHTML = "";


            dayNames.forEach(
                (
                    day,
                    index
                ) => {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "day-card";


                    if (
                        index ===
                        new Date().getDay() - 1
                    ) {

                        card.classList.add(
                            "today"
                        );

                    }


                    let tasks = [];


                    if (
                        index <
                        activeDays
                    ) {

                        const task1 =
                            targets[
                                targetIndex %
                                Math.max(
                                    targets.length,
                                    1
                                )
                            ];


                        targetIndex++;


                        if (task1) {

                            tasks.push(
                                {
                                    skill:
                                        task1.skill,

                                    topic:
                                        task1.topic,

                                    type:
                                        "Learn + Practice"
                                }
                            );

                        }


                        /*
                         Add another task if
                         the user has 2+ hours.
                        */

                        if (
                            dailyHours >= 2
                        ) {

                            const task2 =
                                targets[
                                    targetIndex %
                                    Math.max(
                                        targets.length,
                                        1
                                    )
                                ];


                            if (
                                task2 &&
                                task2.topic !==
                                task1?.topic
                            ) {

                                tasks.push(
                                    {
                                        skill:
                                            task2.skill,

                                        topic:
                                            task2.topic,

                                        type:
                                            "Practice + Review"
                                    }
                                );

                            }


                            targetIndex++;

                        }

                    }


                    let tasksHTML = "";


                    if (!tasks.length) {

                        tasksHTML = `

                            <div class="day-task">

                                <strong>
                                    Rest / Review
                                </strong>

                                <span>
                                    Review previous topics
                                    or take a break.
                                </span>

                            </div>

                        `;

                    }

                    else {

                        tasksHTML =
                            tasks
                                .map(
                                    task => `

                                        <div class="day-task">

                                            <strong>
                                                ${task.skill}
                                            </strong>

                                            <span>
                                                ${task.topic}
                                            </span>

                                            <span>
                                                ${task.type}
                                            </span>

                                        </div>

                                    `
                                )
                                .join("");

                    }


                    card.innerHTML = `

                        <div class="day-name">
                            ${day}
                        </div>

                        <div class="day-date">
                            ${
                                index <
                                activeDays
                                    ? "Study Day"
                                    : "Rest / Review"
                            }
                        </div>

                        ${tasksHTML}

                        <div class="day-total">
                            ${
                                index <
                                activeDays
                                    ? `${dailyHours} ${
                                        dailyHours === 1
                                            ? "hour"
                                            : "hours"
                                    }`
                                    : "Flexible"
                            }
                        </div>

                    `;


                    weeklyPlan.appendChild(
                        card
                    );

                }
            );

        }


        /* =====================================
           LEARNING PRIORITIES
        ====================================== */

        const learningPriorities =
            document.getElementById(
                "learningPriorities"
            );


        if (learningPriorities) {

            learningPriorities.innerHTML =
                "";


            const prioritySkills =
                requiredSkills
                    .filter(
                        skill =>
                            getConfidence(
                                skill
                            ) < 80
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            getConfidence(a) -
                            getConfidence(b)
                    )
                    .slice(
                        0,
                        8
                    );


            if (!prioritySkills.length) {

                learningPriorities.innerHTML = `

                    <div class="empty-plan">

                        🎉 All required career skills
                        currently have strong confidence.

                    </div>

                `;

            }

            else {

                prioritySkills.forEach(
                    (
                        skill,
                        index
                    ) => {

                        const confidence =
                            getConfidence(
                                skill
                            );

                        const locked =
                            !prerequisitesCompleted(
                                skill
                            );


                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "priority-item";


                        item.innerHTML = `

                            <div class="priority-number">
                                ${index + 1}
                            </div>

                            <div class="priority-info">

                                <h3>
                                    ${skill}
                                </h3>

                                <p>
                                    ${
                                        locked
                                            ? `Locked until prerequisites are completed: ${
                                                (
                                                    prerequisites[
                                                        skill
                                                    ] || []
                                                ).join(", ")
                                            }`
                                            : confidence === 0
                                                ? "Start learning this skill."
                                                : "Continue strengthening this skill."
                                    }
                                </p>

                            </div>

                            <div class="priority-confidence">

                                <strong>
                                    ${confidence}%
                                </strong>

                                <span>
                                    ${
                                        locked
                                            ? "Locked"
                                            : confidence >= 50
                                                ? "Developing"
                                                : "Needs Focus"
                                    }
                                </span>

                            </div>

                        `;


                        learningPriorities.appendChild(
                            item
                        );

                    }
                );

            }

        }


        /* =====================================
           SESSION TIME
        ====================================== */

        function getSessionTime(
            requestedMinutes
        ) {

            const dailyMinutes =
                dailyHours * 60;


            /*
             Never recommend more than
             the user's available time.
            */

            if (
                requestedMinutes <=
                dailyMinutes
            ) {

                return formatMinutes(
                    requestedMinutes
                );

            }


            return formatMinutes(
                dailyMinutes
            );

        }


        function formatMinutes(
            minutes
        ) {

            if (
                minutes >=
                60
            ) {

                const hours =
                    Math.floor(
                        minutes / 60
                    );

                const remaining =
                    minutes % 60;


                if (remaining === 0) {

                    return `${hours} ${
                        hours === 1
                            ? "hour"
                            : "hours"
                    }`;

                }


                return `${hours}h ${remaining}m`;

            }


            return `${minutes} min`;

        }

    }
);