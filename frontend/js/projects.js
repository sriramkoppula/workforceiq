/* =========================================
   WorkforceIQ Project Progress System
========================================= */

const projectParams =
    new URLSearchParams(
        window.location.search
    );


const skillName =
    projectParams.get("skill") ||
    "Java Fundamentals";


const topicName =
    projectParams.get("topic") ||
    "Variables and Data Types";


const PROJECT_STORAGE =
    "workforceProjectProgress";


/* =========================================
   PROJECT DATA
========================================= */

const projectData = {

    "Java Fundamentals": {

        title:
            "Student Management System",

        description:
            "Build a simple Java application to manage student information.",

        difficulty:
            "Medium",

        time:
            "4–6 hours",

        objective:
            "Create a Java program that stores student details and performs basic operations such as adding, displaying and searching students.",

        requirements: [
            "Create a Student class",
            "Store student name, ID and marks",
            "Create methods to add students",
            "Display student information",
            "Search for a student"
        ],

        features: [
            "Add Student",
            "View Students",
            "Search Student",
            "Calculate Average Marks"
        ]

    },


    "Variables and Data Types": {

        title:
            "Personal Expense Calculator",

        description:
            "Build a Java program that calculates and summarizes personal expenses.",

        difficulty:
            "Easy",

        time:
            "2–3 hours",

        objective:
            "Use variables and different data types to store expense information and calculate total and average expenses.",

        requirements: [
            "Store expense values",
            "Calculate total expense",
            "Calculate average expense",
            "Display the results",
            "Use appropriate Java data types"
        ],

        features: [
            "Add Expense",
            "Calculate Total",
            "Calculate Average",
            "Display Summary"
        ]

    },


    "Control Flow": {

        title:
            "Student Result Analyzer",

        description:
            "Build a program that calculates student results using conditions and loops.",

        difficulty:
            "Easy",

        time:
            "2–3 hours",

        objective:
            "Use if-else statements and loops to calculate marks, grades and pass/fail status.",

        requirements: [
            "Accept student marks",
            "Calculate total marks",
            "Calculate percentage",
            "Assign grades",
            "Display pass or fail"
        ],

        features: [
            "Enter Marks",
            "Calculate Percentage",
            "Grade Calculation",
            "Pass/Fail Result"
        ]

    },


    "Stacks": {

        title:
            "Browser History Using Stack",

        description:
            "Build a browser-history simulation using the Stack data structure.",

        difficulty:
            "Medium",

        time:
            "3–4 hours",

        objective:
            "Use Stack operations to simulate browser back functionality.",

        requirements: [
            "Implement a stack",
            "Add visited pages",
            "Remove the current page",
            "Display previous page",
            "Handle an empty stack"
        ],

        features: [
            "Visit Page",
            "Go Back",
            "Show Current Page",
            "Show History"
        ]

    },


    "Queues": {

        title:
            "Customer Service Queue",

        description:
            "Build a customer service queue using the FIFO principle.",

        difficulty:
            "Medium",

        time:
            "3–4 hours",

        objective:
            "Implement queue operations and simulate customers waiting for service.",

        requirements: [
            "Implement a queue",
            "Add customers",
            "Serve customers",
            "Display waiting customers",
            "Handle an empty queue"
        ],

        features: [
            "Add Customer",
            "Serve Customer",
            "View Queue",
            "Show Next Customer"
        ]

    },


    "SQL Fundamentals": {

        title:
            "Student Database Management",

        description:
            "Create a basic database system for storing and retrieving student records.",

        difficulty:
            "Medium",

        time:
            "3–5 hours",

        objective:
            "Practice SQL operations such as INSERT, SELECT, UPDATE and filtering.",

        requirements: [
            "Create a Students table",
            "Insert student records",
            "Retrieve student records",
            "Update student information",
            "Filter student records"
        ],

        features: [
            "Add Student",
            "View Students",
            "Search Student",
            "Update Student"
        ]

    }

};


/* =========================================
   FALLBACK PROJECT
========================================= */

const project =
    projectData[skillName] || {

        title:
            skillName + " Mini Project",

        description:
            "Build a small practical project to demonstrate your understanding of " +
            skillName +
            " and " +
            topicName +
            ".",

        difficulty:
            "Medium",

        time:
            "3–5 hours",

        objective:
            "Apply the concepts you learned by building a practical project.",

        requirements: [
            "Use the main concepts learned",
            "Create a working solution",
            "Test the solution",
            "Document your approach",
            "Review the completed project"
        ],

        features: [
            "Core Feature",
            "Input Handling",
            "Processing",
            "Output",
            "Testing"
        ]

    };


/* =========================================
   STORAGE HELPERS
========================================= */

function getProjects() {

    return JSON.parse(
        localStorage.getItem(
            PROJECT_STORAGE
        )
    ) || {};

}


function saveProjects(
    projects
) {

    localStorage.setItem(
        PROJECT_STORAGE,
        JSON.stringify(
            projects
        )
    );

}


function getProjectKey() {

    return (
        skillName +
        "::" +
        topicName
    );

}


/* =========================================
   DEFAULT PROJECT STATE
========================================= */

function getCurrentProject() {

    const projects =
        getProjects();


    const key =
        getProjectKey();


    if (!projects[key]) {

        projects[key] = {

            skill:
                skillName,

            topic:
                topicName,

            completedItems: [],

            completed:
                false,

            score:
                0,

            startedAt:
                new Date()
                    .toISOString(),

            completedAt:
                null

        };


        saveProjects(
            projects
        );

    }


    return projects[key];

}


/* =========================================
   LOAD HEADER
========================================= */

function loadProjectHeader() {

    document.getElementById(
        "projectTitle"
    ).textContent =
        project.title;


    document.getElementById(
        "projectDescription"
    ).textContent =
        project.description;


    document.getElementById(
        "projectDifficulty"
    ).textContent =
        project.difficulty;


    document.getElementById(
        "projectSkill"
    ).textContent =
        skillName;


    document.getElementById(
        "projectTopic"
    ).textContent =
        topicName;


    document.getElementById(
        "projectTime"
    ).textContent =
        project.time;

}


/* =========================================
   LOAD OBJECTIVE
========================================= */

function loadObjective() {

    const objective =
        document.getElementById(
            "projectObjective"
        );


    if (objective) {

        objective.textContent =
            project.objective;

    }

}


/* =========================================
   LOAD REQUIREMENTS
========================================= */

function loadRequirements() {

    const container =
        document.getElementById(
            "requirementsList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    project.requirements.forEach(
        function (requirement) {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                requirement;


            container.appendChild(
                li
            );

        }
    );

}


/* =========================================
   LOAD FEATURES
========================================= */

function loadFeatures() {

    const container =
        document.getElementById(
            "featuresList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    project.features.forEach(
        function (feature) {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                feature;


            container.appendChild(
                li
            );

        }
    );

}


/* =========================================
   CHECKLIST
========================================= */

function createChecklist() {

    const container =
        document.getElementById(
            "projectChecklist"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const current =
        getCurrentProject();


    project.requirements.forEach(
        function (
            requirement,
            index
        ) {

            const item =
                document.createElement(
                    "label"
                );


            item.className =
                "checklist-item";


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.checked =
                current.completedItems
                    .includes(index);


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                requirement;


            checkbox.addEventListener(
                "change",
                function () {

                    updateChecklist(
                        index,
                        checkbox.checked
                    );

                }
            );


            item.appendChild(
                checkbox
            );


            item.appendChild(
                text
            );


            container.appendChild(
                item
            );

        }
    );


    updateChecklistDisplay();

}


/* =========================================
   UPDATE CHECKLIST
========================================= */

function updateChecklist(
    index,
    completed
) {

    const projects =
        getProjects();


    const key =
        getProjectKey();


    const current =
        projects[key];


    if (!current) {
        return;
    }


    if (completed) {

        if (
            !current.completedItems
                .includes(index)
        ) {

            current.completedItems.push(
                index
            );

        }

    } else {

        current.completedItems =
            current.completedItems.filter(
                function (item) {

                    return item !== index;

                }
            );

    }


    projects[key] =
        current;


    saveProjects(
        projects
    );


    updateChecklistDisplay();

}


/* =========================================
   CHECKLIST DISPLAY
========================================= */

function updateChecklistDisplay() {

    const current =
        getCurrentProject();


    const total =
        project.requirements.length;


    const completed =
        current.completedItems.length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    const text =
        document.getElementById(
            "checklistProgressText"
        );


    if (text) {

        text.textContent =
            completed +
            " of " +
            total +
            " completed";

    }


    const bar =
        document.getElementById(
            "checklistProgressBar"
        );


    if (bar) {

        bar.style.width =
            percentage +
            "%";

    }


    const status =
        document.getElementById(
            "projectStatus"
        );


    if (status) {

        if (current.completed) {

            status.textContent =
                "Completed";

        } else if (completed > 0) {

            status.textContent =
                "In Progress";

        } else {

            status.textContent =
                "Not Started";

        }

    }

}


/* =========================================
   COMPLETE PROJECT
========================================= */

function completeProject() {

    const projects =
        getProjects();


    const key =
        getProjectKey();


    const current =
        projects[key];


    if (!current) {
        return;
    }


    const total =
        project.requirements.length;


    const completed =
        current.completedItems.length;


    if (
        completed <
        total
    ) {

        const message =
            document.getElementById(
                "completionMessage"
            );


        if (message) {

            message.textContent =
                "Please complete all checklist items before marking the project complete.";

        }


        return;

    }


    current.completed =
        true;


    current.score =
        100;


    current.completedAt =
        new Date()
            .toISOString();


    projects[key] =
        current;


    saveProjects(
        projects
    );


    updateChecklistDisplay();


    const message =
        document.getElementById(
            "completionMessage"
        );


    if (message) {

        message.textContent =
            "✓ Project completed successfully!";

    }


    const button =
        document.getElementById(
            "completeProjectButton"
        );


    if (button) {

        button.textContent =
            "✓ Project Completed";

        button.disabled =
            true;

    }

}


/* =========================================
   LOAD COMPLETION STATE
========================================= */

function loadCompletionState() {

    const current =
        getCurrentProject();


    const button =
        document.getElementById(
            "completeProjectButton"
        );


    if (
        current.completed &&
        button
    ) {

        button.textContent =
            "✓ Project Completed";

        button.disabled =
            true;

    }

}


/* =========================================
   ADD PROJECT EVIDENCE
========================================= */

function addProjectEvidence() {

    const current =
        getCurrentProject();


    if (!current.completed) {

        const message =
            document.getElementById(
                "completionMessage"
            );


        if (message) {

            message.textContent =
                "Complete the project before adding it as evidence.";

        }


        return;

    }


    localStorage.setItem(
        "workforcePendingProject",
        JSON.stringify({

            skill:
                skillName,

            topic:
                topicName,

            project:
                project.title,

            score:
                current.score,

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
        "&type=project";

}


/* =========================================
   PROJECT STATISTICS
========================================= */

function getCompletedProjectCount() {

    const projects =
        getProjects();


    return Object.values(
        projects
    ).filter(
        function (item) {

            return item.completed === true;

        }
    ).length;

}


function getTotalProjectCount() {

    return Object.keys(
        getProjects()
    ).length;

}


/* =========================================
   GLOBAL PROJECT API
========================================= */

window.WorkforceProjects = {

    getCurrentProject,

    getProjects,

    saveProjects,

    getCompletedProjectCount,

    getTotalProjectCount

};


/* =========================================
   EVENT LISTENERS
========================================= */

const completeProjectButton =
    document.getElementById(
        "completeProjectButton"
    );


if (completeProjectButton) {

    completeProjectButton.addEventListener(
        "click",
        completeProject
    );

}


const evidenceButton =
    document.getElementById(
        "evidenceButton"
    );


if (evidenceButton) {

    evidenceButton.addEventListener(
        "click",
        addProjectEvidence
    );

}


/* =========================================
   INITIALIZE
========================================= */

loadProjectHeader();

loadObjective();

loadRequirements();

loadFeatures();

createChecklist();

loadCompletionState();