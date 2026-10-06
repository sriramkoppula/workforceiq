/* =========================================
   WorkforceIQ Practice System
========================================= */

const practiceParams =
    new URLSearchParams(
        window.location.search
    );


const skillName =
    practiceParams.get("skill") ||
    "Java Fundamentals";


const topicName =
    practiceParams.get("topic") ||
    "Variables and Data Types";


const PRACTICE_STORAGE =
    "workforcePracticeProgress";


/* =========================================
   PRACTICE QUESTIONS
========================================= */

const practiceData = {

    "Java Fundamentals": {

        "Variables and Data Types": [

            {
                title:
                    "Declare a Student Age",

                description:
                    "Create a Java variable to store a student's age and print it.",

                difficulty:
                    "Easy",

                example:
                    "Input: 21\nOutput: 21"

            },

            {
                title:
                    "Calculate Total Marks",

                description:
                    "Create three integer variables representing marks in three subjects and calculate the total.",

                difficulty:
                    "Easy",

                example:
                    "Marks: 80, 75, 90\nOutput: 245"

            },

            {
                title:
                    "Calculate Average",

                description:
                    "Store three subject marks and calculate their average using Java.",

                difficulty:
                    "Easy",

                example:
                    "Marks: 80, 70, 90\nOutput: 80.0"

            }

        ],


        "Control Flow": [

            {
                title:
                    "Check Even or Odd",

                description:
                    "Write a Java program that checks whether a number is even or odd.",

                difficulty:
                    "Easy",

                example:
                    "Input: 12\nOutput: Even"

            },

            {
                title:
                    "Find Largest Number",

                description:
                    "Write a program to find the largest among three numbers using conditional statements.",

                difficulty:
                    "Easy",

                example:
                    "Input: 10, 25, 15\nOutput: 25"

            },

            {
                title:
                    "Print Numbers Using Loop",

                description:
                    "Use a loop to print numbers from 1 to 10.",

                difficulty:
                    "Easy",

                example:
                    "Output: 1 2 3 4 5 6 7 8 9 10"

            }

        ],


        "Stacks": [

            {
                title:
                    "Implement Stack",

                description:
                    "Implement a stack using an array with push and pop operations.",

                difficulty:
                    "Medium",

                example:
                    "push(10)\npush(20)\npop()\nOutput: 20"

            },

            {
                title:
                    "Check Stack Empty",

                description:
                    "Write a method that checks whether a stack contains any elements.",

                difficulty:
                    "Easy",

                example:
                    "Stack: []\nOutput: Empty"

            }

        ],


        "Queues": [

            {
                title:
                    "Implement Queue",

                description:
                    "Implement basic enqueue and dequeue operations using an array.",

                difficulty:
                    "Medium",

                example:
                    "enqueue(10)\nenqueue(20)\ndequeue()\nOutput: 10"

            },

            {
                title:
                    "Customer Queue",

                description:
                    "Design a simple queue system where customers are served in first-in-first-out order.",

                difficulty:
                    "Medium",

                example:
                    "A → B → C\nServe → A"

            }

        ]

    },


    "SQL Fundamentals": {

        "SQL Fundamentals": [

            {
                title:
                    "Select Students",

                description:
                    "Write an SQL query to display all records from a Students table.",

                difficulty:
                    "Easy",

                example:
                    "Table: Students\nOutput: all student records"

            },

            {
                title:
                    "Filter Students",

                description:
                    "Write an SQL query to display students whose age is greater than 18.",

                difficulty:
                    "Easy",

                example:
                    "SELECT students where age > 18"

            },

            {
                title:
                    "Sort Students",

                description:
                    "Write an SQL query to display students ordered by their name.",

                difficulty:
                    "Easy",

                example:
                    "Order students by name ASC"

            }

        ]

    }

};


/* =========================================
   GET QUESTIONS
========================================= */

function getQuestions() {

    const skillData =
        practiceData[skillName];


    if (
        skillData &&
        skillData[topicName]
    ) {

        return skillData[topicName];

    }


    if (
        skillData
    ) {

        const firstTopic =
            Object.keys(
                skillData
            )[0];


        return skillData[firstTopic];

    }


    return [

        {
            title:
                "Practice Problem",

            description:
                "Write a solution related to " +
                skillName +
                " and explain your approach.",

            difficulty:
                "Easy",

            example:
                "Explain your approach clearly."

        },

        {
            title:
                "Concept Challenge",

            description:
                "Solve a basic problem related to " +
                topicName +
                ".",

            difficulty:
                "Easy",

            example:
                "Provide your solution."

        }

    ];

}


const questions =
    getQuestions();


/* =========================================
   STATE
========================================= */

let currentQuestion = 0;

let solvedCount = 0;


/* =========================================
   STORAGE
========================================= */

function getProgress() {

    return JSON.parse(
        localStorage.getItem(
            PRACTICE_STORAGE
        )
    ) || {};

}


function saveProgress(
    progress
) {

    localStorage.setItem(
        PRACTICE_STORAGE,
        JSON.stringify(
            progress
        )
    );

}


function getKey() {

    return (
        skillName +
        "::" +
        topicName
    );

}


/* =========================================
   LOAD SAVED PROGRESS
========================================= */

function loadSavedProgress() {

    const progress =
        getProgress();


    const saved =
        progress[getKey()];


    if (!saved) {

        solvedCount = 0;

        return;

    }


    solvedCount =
        Number(
            saved.solved || 0
        );

}


/* =========================================
   SAVE PRACTICE
========================================= */

function savePracticeProgress() {

    const progress =
        getProgress();


    progress[getKey()] = {

        skill:
            skillName,

        topic:
            topicName,

        solved:
            solvedCount,

        total:
            questions.length,

        percentage:
            Math.round(
                (
                    solvedCount /
                    questions.length
                ) * 100
            ),

        updatedAt:
            new Date()
                .toISOString()

    };


    saveProgress(
        progress
    );

}


/* =========================================
   LOAD HEADER
========================================= */

function loadHeader() {

    document.getElementById(
        "practiceTitle"
    ).textContent =
        topicName + " Practice";


    document.getElementById(
        "practiceDescription"
    ).textContent =
        "Solve practical problems to strengthen your understanding of " +
        topicName +
        ".";


    document.getElementById(
        "practiceSkill"
    ).textContent =
        skillName;


    document.getElementById(
        "practiceTopic"
    ).textContent =
        topicName;


    document.getElementById(
        "practiceCount"
    ).textContent =
        questions.length +
        " Problems";

}


/* =========================================
   LOAD PROBLEM
========================================= */

function loadProblem() {

    if (
        currentQuestion >=
        questions.length
    ) {

        finishPractice();

        return;

    }


    const problem =
        questions[
            currentQuestion
        ];


    document.getElementById(
        "problemNumber"
    ).textContent =
        "Problem " +
        (currentQuestion + 1) +
        " of " +
        questions.length;


    document.getElementById(
        "problemDifficulty"
    ).textContent =
        problem.difficulty;


    document.getElementById(
        "problemTitle"
    ).textContent =
        problem.title;


    document.getElementById(
        "problemDescription"
    ).textContent =
        problem.description;


    document.getElementById(
        "problemExample"
    ).textContent =
        problem.example;


    document.getElementById(
        "solutionInput"
    ).value =
        "";


    document.getElementById(
        "practiceMessage"
    ).textContent =
        "";


    document.getElementById(
        "submitProblemButton"
    ).style.display =
        "inline-block";


    document.getElementById(
        "nextProblemButton"
    ).style.display =
        "none";

}


/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress() {

    const percentage =
        Math.round(
            (
                solvedCount /
                questions.length
            ) * 100
        );


    document.getElementById(
        "practiceProgressText"
    ).textContent =
        solvedCount +
        " of " +
        questions.length +
        " problems completed";


    document.getElementById(
        "practiceProgressPercent"
    ).textContent =
        percentage +
        "%";


    document.getElementById(
        "practiceProgressBar"
    ).style.width =
        percentage +
        "%";

}


/* =========================================
   SUBMIT
========================================= */

function submitProblem() {

    const input =
        document.getElementById(
            "solutionInput"
        );


    const solution =
        input.value.trim();


    const message =
        document.getElementById(
            "practiceMessage"
        );


    if (!solution) {

        message.textContent =
            "Please write your solution before submitting.";

        return;

    }


    solvedCount++;


    savePracticeProgress();

    updateProgress();


    message.textContent =
        "✓ Solution submitted and practice progress updated.";


    document.getElementById(
        "submitProblemButton"
    ).style.display =
        "none";


    document.getElementById(
        "nextProblemButton"
    ).style.display =
        "inline-block";

}


/* =========================================
   NEXT
========================================= */

function nextProblem() {

    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        finishPractice();

        return;

    }


    loadProblem();

}


/* =========================================
   FINISH
========================================= */

function finishPractice() {

    savePracticeProgress();

    updateProgress();


    document.getElementById(
        "problemSection"
    ).style.display =
        "none";


    document.getElementById(
        "completionSection"
    ).style.display =
        "block";


    document.getElementById(
        "completionText"
    ).textContent =
        "You completed " +
        solvedCount +
        " of " +
        questions.length +
        " practice problems for " +
        topicName +
        ".";

}


/* =========================================
   RETRY
========================================= */

function retryPractice() {

    currentQuestion = 0;

    solvedCount = 0;


    savePracticeProgress();

    updateProgress();


    document.getElementById(
        "completionSection"
    ).style.display =
        "none";


    document.getElementById(
        "problemSection"
    ).style.display =
        "block";


    loadProblem();

}


/* =========================================
   ADD EVIDENCE
========================================= */

function addPracticeEvidence() {

    localStorage.setItem(
        "workforcePendingPractice",
        JSON.stringify({

            skill:
                skillName,

            topic:
                topicName,

            solved:
                solvedCount,

            total:
                questions.length,

            score:
                Math.round(
                    (
                        solvedCount /
                        questions.length
                    ) * 100
                ),

            date:
                new Date()
                    .toISOString()

        })
    );


    window.location.href =
        "evidence.html?skill=" +
        encodeURIComponent(
            skillName
        ) +
        "&type=practice";

}


/* =========================================
   EVENT LISTENERS
========================================= */

document
    .getElementById(
        "submitProblemButton"
    )
    .addEventListener(
        "click",
        submitProblem
    );


document
    .getElementById(
        "nextProblemButton"
    )
    .addEventListener(
        "click",
        nextProblem
    );


document
    .getElementById(
        "retryPracticeButton"
    )
    .addEventListener(
        "click",
        retryPractice
    );


document
    .getElementById(
        "evidenceButton"
    )
    .addEventListener(
        "click",
        addPracticeEvidence
    );


/* =========================================
   INITIALIZE
========================================= */

loadSavedProgress();

loadHeader();

updateProgress();

loadProblem();