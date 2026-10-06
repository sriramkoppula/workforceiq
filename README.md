WorkforceIQ

Intelligent Workforce Skill Gap Analysis and Future Readiness Platform

WorkforceIQ is a web-based platform designed to help students and placement aspirants understand their current skills, identify skill gaps for a target career, follow a personalized learning roadmap, and track their career readiness over time.



🎯 Problem Statement

Students often learn multiple technologies but may not know:

\- What skills are required for their target career

\- Which skills they already possess

\- Which skills they are missing

\- How strong their current skills are

\- What they should learn next

\- Whether their learning progress is improving their career readiness

WorkforceIQ provides a structured platform to solve these problems through skill tracking, evidence-based assessment, skill-gap analysis, personalized learning, and progress tracking.



💡 Solution

WorkforceIQ follows this workflow:

Register

&#x20;  ↓

Create Profile

&#x20;  ↓

Select Target Career

&#x20;  ↓

Add Skills

&#x20;  ↓

Add Evidence

&#x20;  ↓

Calculate Career Readiness

&#x20;  ↓

Identify Skill Gaps

&#x20;  ↓

Find Next Best Skill

&#x20;  ↓

Follow Learning Roadmap

&#x20;  ↓

Complete Learning Topics

&#x20;  ↓

Track Study Sessions

&#x20;  ↓

Monitor Progress



🚀 Key Features

👤 User Registration \& Login

Users can create an account and access their personalized WorkforceIQ profile.

📋 Career Profile

Users can provide:

\- Personal information

\- Education

\- Graduation year

\- Target career

\- Career goal

\- Study hours

\- Learning days



🧠 Skill Tracking

Users can add skills related to their selected career and provide their confidence level.

Example:

Java Fundamentals

OOP

Data Structures

SQL

REST API

Spring Boot

Git



📑 Evidence of Skill

Users can add evidence supporting their skills, such as:

\- Projects

\- Coding practice

\- Assessments

\- Recent practice

Evidence contributes to the user's skill confidence and readiness.

📊 Skill Gap Analysis

The platform compares the user's current skills with the skills required for the selected career.

Skills are categorized into:

\- Strong

\- Developing

\- Missing

📈 Career Readiness Dashboard

The dashboard provides:

\- Overall readiness

\- Skills tracked

\- Evidence items

\- Strong skills

\- Developing skills

\- Missing skills

\- Skill gaps

\- Next best skill

\- Learning recommendations

🗺️ Personalized Learning Roadmap

Skills are organized according to prerequisites.

Example:

Java Fundamentals

&#x20;       ↓

&#x20;      OOP

&#x20;       ↓

&#x20;Data Structures

&#x20;       ↓

&#x20;      SQL

&#x20;       ↓

&#x20;    REST API

&#x20;       ↓

&#x20;   Spring Boot





📚 Skill Learning

Each skill contains learning topics.

Users can:

\- Open topics

\- Study topics

\- Complete topics

\- Review completed topics

\- Track learning progress

⏱️ Study Session Tracking

Study sessions are stored in MySQL and include:

\- Skill

\- Duration

\- Session date

\- User

📊 Learning Analytics

The Learning Center displays:

\- Overall learning progress

\- Skills remaining

\- Study time

\- Learning streak

\- Completed topics

\- Completed skills

\- Weekly study activity

📈 Progress History

Users can track career readiness over time through:

\- Current readiness

\- Starting readiness

\- Improvement

\- Skill statistics

\- Readiness history chart

🛠️ Technology Stack

Frontend

\- HTML5

\- CSS3

\- JavaScript

Backend

\- Java

\- Spring Boot

\- Spring Data JPA

\- REST APIs

Database

\- MySQL

Tools

\- Visual Studio Code

\- Git

\- GitHub

\- Maven



🏗️ System Architecture

&#x20;                   WorkforceIQ

&#x20;                        │

&#x20;            ┌───────────┴───────────┐

&#x20;            │                              │

&#x20;        Frontend                         Backend

&#x20;            │                              │

&#x20;     HTML/CSS/JavaScript               Spring Boot

&#x20;                                           │

&#x20;                                        REST APIs

&#x20;                                           │

&#x20;            └───────────┬───────────┘

&#x20;                            |

&#x20;                          MySQL



📂 Project Structure

Intelligent-Workforce-Skill-Gap/

│

├── frontend/

│   ├── index.html

│   ├── login.html

│   ├── register.html

│   ├── forgot-password.html

│   ├── profile.html

│   ├── skills.html

│   ├── evidence.html

│   ├── dashboard.html

│   ├── roadmap.html

│   ├── skill-detail.html

│   ├── learning.html

│   ├── skill-learning.html

│   ├── topic.html

│   ├── study-plan.html

│   ├── practice.html

│   ├── projects.html

│   ├── assessment.html

│   ├── progress.html

│   │

│   ├── css/

│   └── js/

│

├── backend/

│   └── demo/

│       ├── src/

│       ├── pom.xml

│       └── ...

│

├── database/

│

├── docs/

│

└── README.md



🔌 **Main REST APIs**

**Users**

/api/users

**User Skills**

/api/user-skills

**Evidence**

/api/evidence

**Learning Progress**

/api/learning-progress

**Study Sessions**

/api/study-sessions

**Progress History**

/api/progress



**🗄️ Database**

WorkforceIQ uses MySQL for persistent application data.

The backend manages information related to:

\- Users

\- User skills

\- Evidence

\- Learning progress

\- Study sessions

\- Progress history

Spring Boot and Spring Data JPA are used to communicate with the database.



**▶️ How to Run**

1\. Start MySQL

Make sure MySQL is running and the required database is available.

2\. Open the Backend

cd backend\\demo



3\. Build the Backend

On Windows:

.\\mvnw.cmd clean package -DskipTests



4\. Start the Backend

$cp = "target\\classes;$((Get-Content cp.txt -Raw).Trim())"

java -cp $cp com.example.demo.DemoApplication



The backend runs on:

http://localhost:8080



5\. Open the Frontend

Open:

frontend/index.html



in a browser or use a local development server such as VS Code Live Server.



**🧪 Testing**

The main application workflow has been tested successfully:

Registration              ✓

Profile                   ✓

Skills                    ✓

Evidence                  ✓

Dashboard                 ✓

Roadmap                   ✓

Skill Learning            ✓

Topic Learning            ✓

Study Timer               ✓

Learning Center           ✓

Progress                  ✓

Logout/Login              ✓

MySQL Persistence         ✓



The application was tested by creating a user, selecting a career, adding skills and evidence, completing learning activities, recording study sessions, viewing progress, logging out, and logging back in.

🎯 Example Career

One supported career path is:

Java Backend Developer

Required skills include:

Java Fundamentals

OOP

Data Structures

SQL

REST API

Spring Boot

Git



The platform uses these skills to build the user's roadmap and identify areas for improvement.



**🔮 Future Enhancements**

Possible future improvements include:

\- GitHub integration

\- Coding platform integration

\- Job Description analysis

\- AI-powered skill recommendations

\- Personalized project recommendations

\- Multiple career-path comparison

\- Automated skill verification

\- Cloud deployment

\- Advanced learning analytics

\- Resume-based skill extraction

\- Real-time job-market skill analysis



**🎓 Target Users**

WorkforceIQ is primarily designed for:

\- College students

\- Placement aspirants

\- Fresh graduates

\- Career switchers

\- Learners preparing for technical roles



**🌟 Vision**

WorkforceIQ aims to help learners move from:

"I am learning many technologies."



to:

"I know what skills I need, where I currently stand, what I should learn next, and how my career readiness is improving."



👨‍💻 Author

Venkata Sriram Koppula

Computer Science Engineering Student

⭐ WorkforceIQ

Learn Smarter. Identify Gaps. Become Career Ready.



