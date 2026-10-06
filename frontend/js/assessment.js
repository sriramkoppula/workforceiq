// ==========================================
// WORKFORCEIQ - ASSESSMENT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const profile =
        JSON.parse(
            localStorage.getItem("workforceProfile")
        ) || {};


    // ==========================================
    // URL PARAMETERS
    // ==========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const skillName =
        params.get("skill") || "Java";

    const topicName =
        params.get("topic") || "Java Fundamentals";


    // ==========================================
    // USER
    // ==========================================

    const userCircle =
        document.getElementById("userCircle");

    if (
        userCircle &&
        profile.name
    ) {

        userCircle.textContent =
            profile.name
                .charAt(0)
                .toUpperCase();

    }


    // ==========================================
    // ASSESSMENT QUESTIONS
    // ==========================================

    const assessmentData = {

        "Java Fundamentals": [

            {
                question:
                    "Which component executes Java bytecode?",

                options: [
                    "JDK",
                    "JVM",
                    "JRE",
                    "Javadoc"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword is used to create a class in Java?",

                options: [
                    "object",
                    "class",
                    "new",
                    "define"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which method is the entry point of a Java application?",

                options: [
                    "start()",
                    "run()",
                    "main()",
                    "execute()"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword is used to create an object?",

                options: [
                    "class",
                    "this",
                    "new",
                    "object"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Java is primarily which type of programming language?",

                options: [
                    "Object-oriented",
                    "Assembly",
                    "Markup",
                    "Query"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which file extension is used for Java source files?",

                options: [
                    ".class",
                    ".java",
                    ".js",
                    ".jav"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which component provides tools for developing Java programs?",

                options: [
                    "JDK",
                    "JVM",
                    "JRE",
                    "JIT"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which component provides the runtime environment for Java?",

                options: [
                    "JDK",
                    "JRE",
                    "JVM",
                    "Javadoc"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "What does JVM stand for?",

                options: [
                    "Java Variable Machine",
                    "Java Virtual Machine",
                    "Java Verified Machine",
                    "Java Visual Machine"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "What is Java bytecode executed by?",

                options: [
                    "JVM",
                    "JDK",
                    "Compiler",
                    "Editor"
                ],

                answer: 0,

                difficulty: "Beginner"
            }

        ],


        "Variables and Data Types": [

            {
                question:
                    "Which is a primitive data type in Java?",

                options: [
                    "String",
                    "ArrayList",
                    "int",
                    "Scanner"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which data type stores true or false?",

                options: [
                    "int",
                    "boolean",
                    "char",
                    "double"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which data type stores a single character?",

                options: [
                    "String",
                    "char",
                    "character",
                    "text"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which data type is commonly used for decimal values?",

                options: [
                    "int",
                    "boolean",
                    "double",
                    "char"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword can be used to declare a constant variable?",

                options: [
                    "constant",
                    "final",
                    "static",
                    "fixed"
                ],

                answer: 1,

                difficulty: "Intermediate"
            },

            {
                question:
                    "Which type stores whole numbers?",

                options: [
                    "int",
                    "double",
                    "boolean",
                    "char"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which symbol ends a Java statement?",

                options: [
                    ":",
                    ";",
                    ".",
                    ","
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "What is a variable used for?",

                options: [
                    "Store a value",
                    "Compile code",
                    "Create a package",
                    "Run JVM"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which type is used for a sequence of characters?",

                options: [
                    "char",
                    "String",
                    "text",
                    "characters"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which data type can store a large whole number?",

                options: [
                    "byte",
                    "char",
                    "long",
                    "boolean"
                ],

                answer: 2,

                difficulty: "Intermediate"
            }

        ],


        "Control Flow": [

            {
                question:
                    "Which statement is used for decision making?",

                options: [
                    "if",
                    "loop",
                    "import",
                    "package"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which loop is commonly used when the number of iterations is known?",

                options: [
                    "for",
                    "while",
                    "do-while",
                    "switch"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which statement selects between multiple cases?",

                options: [
                    "if",
                    "switch",
                    "for",
                    "break"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword exits a loop?",

                options: [
                    "stop",
                    "exit",
                    "break",
                    "returning"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword skips the current loop iteration?",

                options: [
                    "skip",
                    "continue",
                    "next",
                    "pass"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which loop executes at least once?",

                options: [
                    "for",
                    "while",
                    "do-while",
                    "switch"
                ],

                answer: 2,

                difficulty: "Intermediate"
            },

            {
                question:
                    "What controls whether an if block executes?",

                options: [
                    "Condition",
                    "Class",
                    "Package",
                    "Object"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which loop checks its condition before execution?",

                options: [
                    "while",
                    "do-while",
                    "switch",
                    "case"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which keyword is associated with switch?",

                options: [
                    "case",
                    "loop",
                    "iterate",
                    "condition"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which structure is useful for repeated execution?",

                options: [
                    "Loop",
                    "Package",
                    "Class",
                    "Import"
                ],

                answer: 0,

                difficulty: "Beginner"
            }

        ],


        "Stacks": [

            {
                question:
                    "Which principle does a Stack follow?",

                options: [
                    "FIFO",
                    "LIFO",
                    "Random access",
                    "Priority"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which operation adds an element to a Stack?",

                options: [
                    "Pop",
                    "Push",
                    "Peek",
                    "Delete"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which operation removes the top element?",

                options: [
                    "Push",
                    "Peek",
                    "Pop",
                    "Insert"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which operation views the top element without removing it?",

                options: [
                    "Pop",
                    "Push",
                    "Peek",
                    "Delete"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "If 10, 20 and 30 are pushed into a Stack, which is removed first?",

                options: [
                    "10",
                    "20",
                    "30",
                    "All together"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "What does LIFO mean?",

                options: [
                    "Last In First Out",
                    "Last Input First Output",
                    "Linear In First Out",
                    "List In First Order"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "What happens when pop is performed on an empty Stack?",

                options: [
                    "Overflow",
                    "Underflow",
                    "Sorting",
                    "Nothing always"
                ],

                answer: 1,

                difficulty: "Intermediate"
            },

            {
                question:
                    "Which data structure can be used to implement a Stack?",

                options: [
                    "Array",
                    "Linked List",
                    "Both",
                    "Neither"
                ],

                answer: 2,

                difficulty: "Intermediate"
            },

            {
                question:
                    "A browser's Back operation can be modeled using which structure?",

                options: [
                    "Queue",
                    "Stack",
                    "Graph",
                    "Tree"
                ],

                answer: 1,

                difficulty: "Intermediate"
            },

            {
                question:
                    "Which element is normally accessible in a Stack?",

                options: [
                    "Bottom only",
                    "Top",
                    "Middle only",
                    "Any element equally"
                ],

                answer: 1,

                difficulty: "Beginner"
            }

        ],


        "Queues": [

            {
                question:
                    "Which principle does a Queue follow?",

                options: [
                    "LIFO",
                    "FIFO",
                    "Random access",
                    "Priority"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which operation adds an element to a Queue?",

                options: [
                    "Dequeue",
                    "Enqueue",
                    "Peek",
                    "Pop"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which operation removes an element from a Queue?",

                options: [
                    "Push",
                    "Enqueue",
                    "Dequeue",
                    "Insert"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "What does FIFO mean?",

                options: [
                    "First In First Out",
                    "First Input Final Output",
                    "Fast In Fast Out",
                    "First Index First Order"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "If A, B and C enter a Queue, which is removed first?",

                options: [
                    "A",
                    "B",
                    "C",
                    "All"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Where is a new Queue element normally added?",

                options: [
                    "Front",
                    "Rear",
                    "Middle",
                    "Random"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "From where is an element normally removed?",

                options: [
                    "Rear",
                    "Middle",
                    "Front",
                    "Random"
                ],

                answer: 2,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which real-world system commonly uses a Queue?",

                options: [
                    "Printer jobs",
                    "Browser back",
                    "Undo operation",
                    "Function call stack"
                ],

                answer: 0,

                difficulty: "Intermediate"
            },

            {
                question:
                    "Which structure is useful for BFS traversal?",

                options: [
                    "Stack",
                    "Queue",
                    "Array only",
                    "Heap only"
                ],

                answer: 1,

                difficulty: "Intermediate"
            },

            {
                question:
                    "What is the first element of a Queue called?",

                options: [
                    "Rear",
                    "Top",
                    "Front",
                    "Root"
                ],

                answer: 2,

                difficulty: "Beginner"
            }

        ],


        "SQL Fundamentals": [

            {
                question:
                    "What does SQL stand for?",

                options: [
                    "Simple Query Language",
                    "Structured Query Language",
                    "System Query Logic",
                    "Standard Question Language"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which command retrieves data?",

                options: [
                    "SELECT",
                    "INSERT",
                    "DELETE",
                    "UPDATE"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which command adds new records?",

                options: [
                    "SELECT",
                    "INSERT",
                    "UPDATE",
                    "CREATE"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which command modifies existing records?",

                options: [
                    "UPDATE",
                    "SELECT",
                    "INSERT",
                    "READ"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which command removes records?",

                options: [
                    "REMOVE",
                    "DELETE",
                    "DROP ROW",
                    "CLEAR"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which SQL clause filters records?",

                options: [
                    "WHERE",
                    "ORDER",
                    "FILTER",
                    "GROUP"
                ],

                answer: 0,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which clause sorts query results?",

                options: [
                    "SORT BY",
                    "ORDER BY",
                    "ARRANGE",
                    "SEQUENCE"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "What uniquely identifies a record in a table?",

                options: [
                    "Foreign key",
                    "Primary key",
                    "Column",
                    "Index only"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "A database table is made up of rows and what?",

                options: [
                    "Programs",
                    "Columns",
                    "Classes",
                    "Methods"
                ],

                answer: 1,

                difficulty: "Beginner"
            },

            {
                question:
                    "Which command creates a table?",

                options: [
                    "MAKE TABLE",
                    "CREATE TABLE",
                    "NEW TABLE",
                    "ADD TABLE"
                ],

                answer: 1,

                difficulty: "Beginner"
            }

        ]

    };


    // ==========================================
    // FALLBACK QUESTIONS
    // ==========================================

    const fallbackQuestions = [

        {
            question:
                `What is the best way to learn ${topicName}?`,

            options: [
                "Only read theory",
                "Only watch videos",
                "Learn, practice and apply",
                "Skip practice"
            ],

            answer: 2,

            difficulty: "Beginner"
        },

        {
            question:
                `What should you do after learning ${topicName}?`,

            options: [
                "Never practice",
                "Practice and build",
                "Forget it",
                "Skip examples"
            ],

            answer: 1,

            difficulty: "Beginner"
        },

        {
            question:
                `Which approach improves practical understanding?`,

            options: [
                "Practice",
                "Avoid coding",
                "Only memorize",
                "Skip projects"
            ],

            answer: 0,

            difficulty: "Beginner"
        }

    ];


    let questions =
        assessmentData[topicName] ||
        fallbackQuestions;


    // ==========================================
    // STORAGE
    // ==========================================

    const storageKey =
        `${skillName}::${topicName}`;


    let savedAssessments =
        JSON.parse(
            localStorage.getItem(
                "workforceAssessments"
            )
        ) || {};


    // ==========================================
    // STATE
    // ==========================================

    let currentQuestion = 0;

    let selectedAnswer = null;

    let correctCount = 0;

    let answered = false;


    // ==========================================
    // DOM ELEMENTS
    // ==========================================

    const startSection =
        document.getElementById(
            "startSection"
        );

    const questionSection =
        document.getElementById(
            "questionSection"
        );

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    // ==========================================
    // LOAD HEADER
    // ==========================================

    document.getElementById(
        "assessmentTitle"
    ).textContent =
        `${topicName} Assessment`;


    document.getElementById(
        "assessmentDescription"
    ).textContent =
        `Test your understanding of ${topicName} and measure your current knowledge.`;


    document.getElementById(
        "assessmentSkill"
    ).textContent =
        skillName;


    document.getElementById(
        "assessmentTopic"
    ).textContent =
        topicName;


    document.getElementById(
        "totalQuestions"
    ).textContent =
        questions.length;


    // ==========================================
    // START ASSESSMENT
    // ==========================================

    document
        .getElementById(
            "startAssessmentButton"
        )
        .addEventListener(
            "click",
            startAssessment
        );


    function startAssessment() {

        currentQuestion = 0;

        selectedAnswer = null;

        correctCount = 0;

        answered = false;


        startSection.style.display =
            "none";

        resultSection.style.display =
            "none";

        questionSection.style.display =
            "block";


        loadQuestion();

    }


    // ==========================================
    // LOAD QUESTION
    // ==========================================

    function loadQuestion() {

        const question =
            questions[currentQuestion];


        selectedAnswer = null;

        answered = false;


        document.getElementById(
            "questionNumber"
        ).textContent =
            currentQuestion + 1;


        document.getElementById(
            "questionText"
        ).textContent =
            question.question;


        document.getElementById(
            "questionDifficulty"
        ).textContent =
            question.difficulty;


        const progress =
            (
                currentQuestion /
                questions.length
            ) * 100;


        document.getElementById(
            "questionProgressBar"
        ).style.width =
            `${progress}%`;


        const optionsContainer =
            document.getElementById(
                "questionOptions"
            );


        optionsContainer.innerHTML = "";


        question.options.forEach(
            function (option, index) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "assessment-option";


                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function () {

                        if (answered) {
                            return;
                        }


                        selectedAnswer =
                            index;


                        document
                            .querySelectorAll(
                                ".assessment-option"
                            )
                            .forEach(
                                item => {

                                    item.classList
                                        .remove(
                                            "selected"
                                        );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );


                optionsContainer.appendChild(
                    button
                );

            }
        );


        document.getElementById(
            "answerResult"
        ).textContent = "";


        document.getElementById(
            "submitAnswerButton"
        ).style.display =
            "inline-flex";


        document.getElementById(
            "nextQuestionButton"
        ).style.display =
            "none";

    }


    // ==========================================
    // SUBMIT ANSWER
    // ==========================================

    document
        .getElementById(
            "submitAnswerButton"
        )
        .addEventListener(
            "click",
            submitAnswer
        );


    function submitAnswer() {

        if (selectedAnswer === null) {

            alert(
                "Please select an answer first."
            );

            return;

        }


        if (answered) {
            return;
        }


        answered = true;


        const question =
            questions[currentQuestion];


        const options =
            document.querySelectorAll(
                ".assessment-option"
            );


        options.forEach(
            function (button, index) {

                button.disabled = true;


                if (
                    index ===
                    question.answer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                if (
                    index === selectedAnswer &&
                    selectedAnswer !==
                    question.answer
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        const result =
            document.getElementById(
                "answerResult"
            );


        if (
            selectedAnswer ===
            question.answer
        ) {

            correctCount++;

            result.textContent =
                "✓ Correct answer!";

            result.style.color =
                "#16a34a";

        } else {

            result.textContent =
                `✗ Incorrect. Correct answer: ${question.options[question.answer]}`;

            result.style.color =
                "#dc2626";

        }


        document.getElementById(
            "submitAnswerButton"
        ).style.display =
            "none";


        const nextButton =
            document.getElementById(
                "nextQuestionButton"
            );


        nextButton.style.display =
            "inline-flex";


        if (
            currentQuestion ===
            questions.length - 1
        ) {

            nextButton.textContent =
                "View Result →";

        } else {

            nextButton.textContent =
                "Next Question →";

        }

    }


    // ==========================================
    // NEXT QUESTION
    // ==========================================

    document
        .getElementById(
            "nextQuestionButton"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentQuestion <
                    questions.length - 1
                ) {

                    currentQuestion++;

                    loadQuestion();

                } else {

                    finishAssessment();

                }

            }
        );


    // ==========================================
    // FINISH ASSESSMENT
    // ==========================================

    function finishAssessment() {

        const total =
            questions.length;


        const score =
            Math.round(
                (correctCount / total) * 100
            );


        const wrongCount =
            total - correctCount;


        const assessmentResult = {

            skill:
                skillName,

            topic:
                topicName,

            score:
                score,

            correct:
                correctCount,

            wrong:
                wrongCount,

            total:
                total,

            date:
                new Date().toISOString()

        };


        savedAssessments[storageKey] =
            assessmentResult;


        localStorage.setItem(
            "workforceAssessments",
            JSON.stringify(
                savedAssessments
            )
        );


        questionSection.style.display =
            "none";


        resultSection.style.display =
            "block";


        document.getElementById(
            "finalScore"
        ).textContent =
            `${score}%`;


        document.getElementById(
            "correctAnswers"
        ).textContent =
            correctCount;


        document.getElementById(
            "wrongAnswers"
        ).textContent =
            wrongCount;


        document.getElementById(
            "finalAccuracy"
        ).textContent =
            `${score}%`;


        let message;


        if (score >= 80) {

            message =
                "Excellent! You have a strong understanding of this topic.";

        } else if (score >= 60) {

            message =
                "Good progress! Review the weaker areas and practice more.";

        } else {

            message =
                "Keep learning! Review the topic and try the assessment again.";

        }


        document.getElementById(
            "resultMessage"
        ).textContent =
            message;

    }


    // ==========================================
    // RETRY
    // ==========================================

    document
        .getElementById(
            "retryButton"
        )
        .addEventListener(
            "click",
            function () {

                startAssessment();

            }
        );


    // ==========================================
    // ADD ASSESSMENT EVIDENCE
    // ==========================================

    document
        .getElementById(
            "evidenceButton"
        )
        .addEventListener(
            "click",
            function () {

                const result =
                    savedAssessments[
                        storageKey
                    ];


                if (!result) {

                    alert(
                        "Please complete the assessment first."
                    );

                    return;

                }


                localStorage.setItem(
                    "workforcePendingAssessment",
                    JSON.stringify({

                        skill:
                            skillName,

                        topic:
                            topicName,

                        score:
                            result.score,

                        correct:
                            result.correct,

                        total:
                            result.total,

                        date:
                            result.date

                    })
                );


                window.location.href =
                    `evidence.html?skill=${encodeURIComponent(skillName)}&type=assessment`;

            }
        );

});