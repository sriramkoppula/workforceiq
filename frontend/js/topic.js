// ==========================================
// WORKFORCEIQ - TOPIC LEARNING
// ==========================================

const API_URL = window.API_URL || "http://localhost:8080/api";

const profile =
    JSON.parse(localStorage.getItem("workforceProfile")) || {};

const loggedInUser =
    JSON.parse(localStorage.getItem("workforceLoggedInUser")) ||
    JSON.parse(localStorage.getItem("workforceRegisteredUser")) ||
    {};


// ==========================================
// URL PARAMETERS
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const skillName =
    params.get("skill");

const topicName =
    params.get("topic");


// ==========================================
// CHECK PROFILE
// ==========================================

if (!profile && !loggedInUser) {
    window.location.href = "profile.html";
}


// ==========================================
// TOPIC DATA
// ==========================================

const topicData = {

    "Java Fundamentals": {

        description:
            "Understand Java, its features, JVM architecture and the basic structure of a Java program.",

        hours: 3,

        concepts: [
            "What is Java?",
            "Features of Java",
            "JDK, JRE and JVM",
            "How Java code works",
            "Structure of a Java program",
            "Compiling and running Java programs"
        ],

        content: `
            <h3>What is Java?</h3>

            <p>
                Java is a high-level, object-oriented programming
                language widely used for backend development,
                web applications, Android applications and
                enterprise software.
            </p>

            <h3>Why Learn Java?</h3>

            <ul>
                <li>Object-oriented programming</li>
                <li>Platform independent</li>
                <li>Strong ecosystem</li>
                <li>Large developer community</li>
                <li>Widely used in backend development</li>
            </ul>

            <h3>JDK, JRE and JVM</h3>

            <p>
                The <strong>JDK</strong> provides tools required
                to develop Java applications.
            </p>

            <p>
                The <strong>JRE</strong> provides the environment
                required to run Java applications.
            </p>

            <p>
                The <strong>JVM</strong> executes Java bytecode.
            </p>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                JDK → Develop<br>
                JRE → Run<br>
                JVM → Execute
            </div>
        `,

        question:
            "Which component executes Java bytecode?",

        options: [
            "JDK",
            "JVM",
            "JRE",
            "Javadoc"
        ],

        answer: 1
    },


    "Variables and Data Types": {

        description:
            "Learn how Java stores information using variables and different data types.",

        hours: 2,

        concepts: [
            "Variables",
            "Primitive data types",
            "Reference data types",
            "Type conversion",
            "Constants",
            "Input and output"
        ],

        content: `
            <h3>Variables</h3>

            <p>
                A variable is a named memory location used
                to store a value.
            </p>

            <pre>
int age = 20;
String name = "Ram";
            </pre>

            <h3>Primitive Data Types</h3>

            <ul>
                <li>byte</li>
                <li>short</li>
                <li>int</li>
                <li>long</li>
                <li>float</li>
                <li>double</li>
                <li>char</li>
                <li>boolean</li>
            </ul>

            <h3>Example</h3>

            <pre>
int age = 20;
double price = 99.5;
char grade = 'A';
boolean passed = true;
            </pre>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                A variable has a data type,
                name and value.
            </div>
        `,

        question:
            "Which of these is a primitive data type in Java?",

        options: [
            "String",
            "ArrayList",
            "int",
            "Scanner"
        ],

        answer: 2
    },


    "Control Flow": {

        description:
            "Learn how to control program execution using conditions and loops.",

        hours: 3,

        concepts: [
            "if statement",
            "if-else",
            "else-if",
            "switch",
            "for loop",
            "while loop",
            "do-while loop",
            "break and continue"
        ],

        content: `
            <h3>What is Control Flow?</h3>

            <p>
                Control flow determines the order in which
                statements in a program are executed.
            </p>

            <h3>if Statement</h3>

            <pre>
if (age >= 18) {
    System.out.println("Adult");
}
            </pre>

            <h3>for Loop</h3>

            <pre>
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
            </pre>

            <h3>while Loop</h3>

            <pre>
int i = 0;

while (i < 5) {
    System.out.println(i);
    i++;
}
            </pre>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                if → decision<br>
                for → repeated execution<br>
                while → repeat while condition is true
            </div>
        `,

        question:
            "Which loop is commonly used when the number of iterations is known?",

        options: [
            "for loop",
            "while loop",
            "do-while loop",
            "switch"
        ],

        answer: 0
    },


    "Stacks": {

        description:
            "Learn the Stack data structure and its operations.",

        hours: 3,

        concepts: [
            "Stack concept",
            "LIFO principle",
            "Push",
            "Pop",
            "Peek",
            "Stack using array",
            "Stack using linked list",
            "Stack problems"
        ],

        content: `
            <h3>What is a Stack?</h3>

            <p>
                A stack is a linear data structure that follows
                the <strong>LIFO</strong> principle.
            </p>

            <p>
                LIFO means:
                <strong>Last In, First Out</strong>.
            </p>

            <h3>Main Operations</h3>

            <ul>
                <li><strong>Push</strong> → Add an element</li>
                <li><strong>Pop</strong> → Remove the top element</li>
                <li><strong>Peek</strong> → View the top element</li>
            </ul>

            <h3>Example</h3>

            <pre>
Stack:

10
20
30  ← Top

Push(40)

10
20
30
40  ← Top
            </pre>

            <p>
                When we perform pop(), 40 will be removed first.
            </p>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                Stack = LIFO<br>
                Push = Add<br>
                Pop = Remove<br>
                Peek = See top
            </div>
        `,

        question:
            "Which principle does a Stack follow?",

        options: [
            "FIFO",
            "LIFO",
            "Random access",
            "Priority"
        ],

        answer: 1
    },


    "Queues": {

        description:
            "Learn the Queue data structure and FIFO-based operations.",

        hours: 3,

        concepts: [
            "Queue concept",
            "FIFO principle",
            "Enqueue",
            "Dequeue",
            "Front",
            "Rear",
            "Circular Queue",
            "Queue problems"
        ],

        content: `
            <h3>What is a Queue?</h3>

            <p>
                A queue is a linear data structure that follows
                the <strong>FIFO</strong> principle.
            </p>

            <p>
                FIFO means:
                <strong>First In, First Out</strong>.
            </p>

            <h3>Main Operations</h3>

            <ul>
                <li><strong>Enqueue</strong> → Add an element</li>
                <li><strong>Dequeue</strong> → Remove an element</li>
                <li><strong>Front</strong> → First element</li>
                <li><strong>Rear</strong> → Last element</li>
            </ul>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                Queue = FIFO<br>
                Enqueue = Add<br>
                Dequeue = Remove
            </div>
        `,

        question:
            "Which principle does a Queue follow?",

        options: [
            "LIFO",
            "FIFO",
            "Random access",
            "Binary order"
        ],

        answer: 1
    },


    "SQL Fundamentals": {

        description:
            "Understand relational databases and the fundamentals of SQL.",

        hours: 2,

        concepts: [
            "What is SQL?",
            "Database basics",
            "Tables",
            "Rows and columns",
            "Primary keys",
            "Basic SQL syntax"
        ],

        content: `
            <h3>What is SQL?</h3>

            <p>
                SQL stands for
                <strong>Structured Query Language</strong>.
                It is used to interact with relational databases.
            </p>

            <h3>Database Table</h3>

            <p>
                Data in a relational database is commonly
                organized into tables containing rows and columns.
            </p>

            <h3>Example</h3>

            <pre>
SELECT *
FROM students;
            </pre>

            <p>
                This query retrieves all columns and rows
                from the students table.
            </p>

            <h3>Primary Key</h3>

            <p>
                A primary key uniquely identifies a record
                in a table.
            </p>

            <div class="learning-note">
                <strong>Remember:</strong><br>
                SQL → communicate with relational databases.
            </div>
        `,

        question:
            "What does SQL stand for?",

        options: [
            "Simple Query Language",
            "Structured Query Language",
            "System Query Logic",
            "Standard Question Language"
        ],

        answer: 1
    }

};


// ==========================================
// CURRENT TOPIC
// ==========================================

const currentTopic =
    topicData[topicName] || {

        description:
            `Learn ${topicName || "this topic"} step by step.`,

        hours: 2,

        concepts: [
            `Understand ${topicName || "the topic"}`,
            "Learn the fundamentals",
            "Study examples",
            "Practice the concept",
            "Solve related problems"
        ],

        content: `
            <h3>Learn ${topicName || "this topic"}</h3>

            <p>
                Start by understanding the basic concepts,
                terminology and practical applications.
            </p>

            <h3>Recommended Approach</h3>

            <ol>
                <li>Understand the fundamentals.</li>
                <li>Study examples.</li>
                <li>Practice the concept.</li>
                <li>Solve problems.</li>
                <li>Build something practical.</li>
            </ol>
        `,

        question:
            `What is the best way to learn ${topicName || "this topic"}?`,

        options: [
            "Only read",
            "Only watch videos",
            "Learn, practice and apply",
            "Skip practice"
        ],

        answer: 2
    };


// ==========================================
// LOAD USER
// ==========================================

function loadUser() {

    const circle =
        document.getElementById("userCircle");

    if (circle && loggedInUser.name) {

        circle.textContent =
            loggedInUser.name
                .charAt(0)
                .toUpperCase();

    }

}


// ==========================================
// LOAD TOPIC
// ==========================================

function loadTopic() {

    const nameElement =
        document.getElementById("topicName");

    const descriptionElement =
        document.getElementById("topicDescription");

    const hoursElement =
        document.getElementById("topicHours");

    if (nameElement) {

        nameElement.textContent =
            topicName || "Topic";

    }

    if (descriptionElement) {

        descriptionElement.textContent =
            currentTopic.description;

    }

    if (hoursElement) {

        hoursElement.textContent =
            `${currentTopic.hours} hrs`;

    }

    renderConcepts();

    renderLearningContent();

}


// ==========================================
// CONCEPTS
// ==========================================

function renderConcepts() {

    const container =
        document.getElementById("conceptsList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    currentTopic.concepts.forEach(
        (concept, index) => {

            const item =
                document.createElement("div");

            item.className =
                "concept-item";

            item.innerHTML = `
                <span class="concept-number">
                    ${index + 1}
                </span>

                <p>
                    ${concept}
                </p>
            `;

            container.appendChild(item);

        }
    );

}


// ==========================================
// LEARNING CONTENT
// ==========================================

function renderLearningContent() {

    const container =
        document.getElementById("learningContent");

    if (!container) {
        return;
    }

    container.innerHTML =
        currentTopic.content;

}


// ==========================================
// GET LOCAL PROGRESS
// ==========================================

function getProgress() {

    const allProgress =
        JSON.parse(
            localStorage.getItem(
                "workforceTopicProgress"
            )
        ) || {};

    if (
        allProgress[skillName] &&
        allProgress[skillName][topicName] &&
        allProgress[skillName][topicName].completed
    ) {

        return 100;

    }

    return 0;

}


// ==========================================
// UPDATE PROGRESS UI
// ==========================================

function updateProgress() {

    const progress =
        getProgress();

    const text =
        document.getElementById(
            "topicProgress"
        );

    const bar =
        document.getElementById(
            "topicProgressBar"
        );

    if (text) {

        text.textContent =
            `${progress}%`;

    }

    if (bar) {

        bar.style.width =
            `${progress}%`;

    }

    const button =
        document.getElementById(
            "completeTopicButton"
        );

    if (
        progress === 100 &&
        button
    ) {

        button.textContent =
            "✓ Topic Completed";

        button.disabled =
            true;

    }

}


// ==========================================
// RESOURCES
// ==========================================

function loadResources() {

    const encodedSkill =
        encodeURIComponent(
            skillName || ""
        );

    const encodedTopic =
        encodeURIComponent(
            topicName || ""
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
            `https://www.google.com/search?q=${encodedSkill}+${encodedTopic}+official+documentation`;

    }

    if (video) {

        video.href =
            `https://www.youtube.com/results?search_query=${encodedSkill}+${encodedTopic}+tutorial`;

    }

    if (practice) {

        practice.href =
            `https://www.google.com/search?q=${encodedSkill}+${encodedTopic}+practice+problems`;

    }

}


// ==========================================
// BACK TO SKILL
// ==========================================

function setupBackButton() {

    const button =
        document.getElementById(
            "backToSkill"
        );

    if (button) {

        button.href =
            `skill-learning.html?skill=${encodeURIComponent(skillName)}`;

    }

}


// ==========================================
// PRACTICE
// ==========================================

function setupPracticeButton() {

    const button =
        document.getElementById(
            "practiceButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            window.location.href =
                `problems.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topicName)}`;

        }
    );

}


// ==========================================
// MINI PROJECT
// ==========================================

function setupProjectButton() {

    const button =
        document.getElementById(
            "projectButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            window.location.href =
                `projects.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topicName)}`;

        }
    );

}


// ==========================================
// ASSESSMENT
// ==========================================

function setupAssessmentButton() {

    const button =
        document.getElementById(
            "assessmentButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            window.location.href =
                `assessment.html?skill=${encodeURIComponent(skillName)}&topic=${encodeURIComponent(topicName)}`;

        }
    );

}


// ==========================================
// QUIZ
// ==========================================

let selectedAnswer = null;


function loadQuiz() {

    const question =
        document.getElementById(
            "quizQuestion"
        );

    const options =
        document.getElementById(
            "quizOptions"
        );

    if (!question || !options) {
        return;
    }

    question.textContent =
        currentTopic.question;

    options.innerHTML = "";

    currentTopic.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "quiz-option";

            button.type =
                "button";

            button.textContent =
                option;

            button.addEventListener(
                "click",
                function () {

                    selectedAnswer =
                        index;

                    document
                        .querySelectorAll(
                            ".quiz-option"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );

                    button.classList.add(
                        "selected"
                    );

                }
            );

            options.appendChild(button);

        }
    );

}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer() {

    if (
        selectedAnswer === null
    ) {

        alert(
            "Please select an answer first."
        );

        return;

    }

    const result =
        document.getElementById(
            "quizResult"
        );

    if (!result) {
        return;
    }

    if (
        selectedAnswer ===
        currentTopic.answer
    ) {

        result.textContent =
            "✓ Correct! Great job.";

        result.style.color =
            "#16a34a";

    } else {

        result.textContent =
            "✗ Incorrect. Review the topic and try again.";

        result.style.color =
            "#dc2626";

    }

}


// ==========================================
// GET USER ID
// ==========================================

function getUserId() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "workforceLoggedInUser"
            )
        ) ||
        JSON.parse(
            localStorage.getItem(
                "workforceRegisteredUser"
            )
        ) ||
        {};

    if (!user.id) {

        console.error(
            "WorkforceIQ: User ID not found.",
            user
        );

        return null;

    }

    return Number(user.id);

}


// ==========================================
// COMPLETE TOPIC
// ==========================================

async function completeTopic() {

    const button =
        document.getElementById(
            "completeTopicButton"
        );

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Saving...";

    }


    // --------------------------------------
    // USER ID
    // --------------------------------------

    const userId =
        getUserId();

    if (!userId) {

        alert(
            "User ID not found.\n\nPlease logout and login again."
        );

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Complete Topic";

        }

        return;

    }


    // --------------------------------------
    // SAVE LOCAL PROGRESS
    // --------------------------------------

    const allProgress =
        JSON.parse(
            localStorage.getItem(
                "workforceTopicProgress"
            )
        ) || {};

    if (!allProgress[skillName]) {

        allProgress[skillName] =
            {};

    }

    allProgress[skillName][topicName] = {

        progress: 100,

        completed: true,

        completedAt:
            new Date().toISOString()

    };

    localStorage.setItem(
        "workforceTopicProgress",
        JSON.stringify(
            allProgress
        )
    );


    // --------------------------------------
    // SAVE TO MYSQL THROUGH SPRING BOOT
    // --------------------------------------

    try {

        console.log(
            "Saving learning progress:",
            {
                userId: userId,
                skillName: skillName,
                topicName: topicName,
                progress: 100,
                completed: true
            }
        );

        const response =
            await fetch(
                `${API_URL}/learning-progress`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            userId:
                                userId,

                            skillName:
                                skillName,

                            topicName:
                                topicName,

                            progress:
                                100,

                            completed:
                                true
                        })
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Learning progress response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}: ${responseText}`
            );

        }


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        updateProgress();

        if (button) {

            button.textContent =
                "✓ Topic Completed";

            button.disabled =
                true;

        }

        console.log(
            "✓ Learning progress saved successfully."
        );

        alert(
            "Topic completed successfully!"
        );

    } catch (error) {

        console.error(
            "Learning progress save failed:",
            error
        );


        // Local progress remains saved,
        // but tell the user MySQL sync failed.

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Complete Topic";

        }

        alert(
            "Topic was saved locally, but could not be saved to MySQL.\n\n" +
            "Make sure Spring Boot is running on port 8080."
        );

    }

}


// ==========================================
// STUDY TIMER
// ==========================================

let timerInterval =
    null;

let sessionStartTime =
    null;

let elapsedSeconds =
    0;

const studySessionsKey =
    "workforceStudySessions";


function formatTimer(seconds) {

    const hours =
        Math.floor(
            seconds / 3600
        );

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


function updateTimerDisplay() {

    const timerDisplay =
        document.getElementById(
            "timerDisplay"
        );

    if (timerDisplay) {

        timerDisplay.textContent =
            formatTimer(
                elapsedSeconds
            );

    }

}


function startStudySession() {

    if (timerInterval) {
        return;
    }

    sessionStartTime =
        Date.now();

    const startButton =
        document.getElementById(
            "startTimerButton"
        );

    const stopButton =
        document.getElementById(
            "stopTimerButton"
        );

    const status =
        document.getElementById(
            "timerStatus"
        );

    if (startButton) {

        startButton.disabled =
            true;

    }

    if (stopButton) {

        stopButton.disabled =
            false;

    }

    if (status) {

        status.textContent =
            "Learning in progress...";

    }

    timerInterval =
        setInterval(
            () => {

                elapsedSeconds =
                    Math.floor(
                        (
                            Date.now() -
                            sessionStartTime
                        ) / 1000
                    );

                updateTimerDisplay();

            },
            1000
        );

}


async function stopStudySession() {

    if (!timerInterval) {
        return;
    }


    clearInterval(
        timerInterval
    );

    timerInterval =
        null;


    const duration =
        elapsedSeconds;


    const startButton =
        document.getElementById(
            "startTimerButton"
        );

    const stopButton =
        document.getElementById(
            "stopTimerButton"
        );

    const status =
        document.getElementById(
            "timerStatus"
        );


    if (startButton) {

        startButton.disabled =
            false;

    }


    if (stopButton) {

        stopButton.disabled =
            true;

    }


    if (status) {

        status.textContent =
            "Session completed";

    }


    // ==========================================
    // SAVE STUDY SESSION TO MYSQL
    // ==========================================

    if (duration >= 5) {

        const loggedInUser =
            JSON.parse(
                localStorage.getItem(
                    "workforceLoggedInUser"
                )
            ) ||
            JSON.parse(
                localStorage.getItem(
                    "workforceRegisteredUser"
                )
            ) ||
            {};


        const userId =
            Number(
                loggedInUser.id
            );


        if (!userId) {

            console.error(
                "User ID not found."
            );

        } else {

            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/study-sessions",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    userId:
                                        userId,

                                    skill:
                                        skillName,

                                    duration:
                                        duration,

                                    sessionDate:
                                        new Date()
                                            .toISOString()

                                })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        `Backend returned ${response.status}: ${errorText}`
                    );
                }


                const savedSession =
                    await response.json();


                console.log(
                    "Study session saved to MySQL:",
                    savedSession
                );


                if (status) {

                    status.textContent =
                        "Session saved successfully";

                }


            } catch (error) {

                console.error(
                    "Study session backend error:",
                    error
                );


                if (status) {

                    status.textContent =
                        "Session completed, but MySQL save failed";

                }

            }

        }

    }


    elapsedSeconds =
        0;


    updateTimerDisplay();

}


function formatStudyMinutes(minutes) {

    if (minutes < 60) {

        return `${minutes} min`;

    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const remainingMinutes =
        minutes % 60;

    if (
        remainingMinutes === 0
    ) {

        return `${hours} hr`;

    }

    return `${hours} hr ${remainingMinutes} min`;

}


async function updateStudyStats() {

    const userId = getUserId();

    if (!userId) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/study-sessions/user/${userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load study sessions"
            );
        }

        const sessions = await response.json();

        const today =
            new Date().toDateString();

        let todaySeconds = 0;
        let totalSeconds = 0;

        sessions.forEach(session => {

            const duration =
                Number(session.duration) || 0;

            totalSeconds += duration;

            if (session.sessionDate) {

                const sessionDate =
                    new Date(
                        session.sessionDate
                    ).toDateString();

                if (sessionDate === today) {
                    todaySeconds += duration;
                }
            }
        });

        const todayMinutes =
            Math.floor(todaySeconds / 60);

        const totalMinutes =
            Math.floor(totalSeconds / 60);

        const todayElement =
            document.getElementById(
                "todayStudyTime"
            );

        const totalElement =
            document.getElementById(
                "totalStudyTime"
            );

        if (todayElement) {

            todayElement.textContent =
                formatStudyMinutes(
                    todayMinutes
                );
        }

        if (totalElement) {

            totalElement.textContent =
                formatStudyMinutes(
                    totalMinutes
                );
        }

        console.log(
            "Study statistics loaded from MySQL:",
            sessions
        );

    } catch (error) {

        console.error(
            "Study statistics backend error:",
            error
        );
    }
}

function setupStudyTimer() {

    const startButton =
        document.getElementById(
            "startTimerButton"
        );

    const stopButton =
        document.getElementById(
            "stopTimerButton"
        );

    if (
        !startButton ||
        !stopButton
    ) {

        return;

    }

    startButton.addEventListener(
        "click",
        startStudySession
    );

    stopButton.addEventListener(
        "click",
        stopStudySession
    );

    updateTimerDisplay();

    updateStudyStats();

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            !skillName ||
            !topicName
        ) {

            window.location.href =
                "learning.html";

            return;

        }


        loadUser();

        loadTopic();

        loadResources();

        setupBackButton();

        loadQuiz();

        updateProgress();

        setupStudyTimer();

        setupPracticeButton();

        setupProjectButton();

        setupAssessmentButton();


        const quizButton =
            document.getElementById(
                "checkAnswerButton"
            );

        if (quizButton) {

            quizButton.addEventListener(
                "click",
                checkAnswer
            );

        }


        const completeButton =
            document.getElementById(
                "completeTopicButton"
            );

        if (completeButton) {

            completeButton.addEventListener(
                "click",
                completeTopic
            );

        }

    }
);