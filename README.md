# Kaizen AI

**Author:** Sudhanshu Gaikwad

## About Kaizen AI

**Kaizen AI** is a comprehensive, AI-powered career coaching platform designed to empower students, job seekers, and professionals. By leveraging cutting-edge generative AI, Kaizen AI provides a suite of intelligent tools that streamline the job search process, offer personalized guidance, and help users confidently navigate their career paths.

Our mission is to eliminate the friction in career growth by providing accessible, smart, and actionable tools that help users land their dream jobs.

## Key Features

-   **AI Roadmap Generator:** Get a personalized, step-by-step career plan with timelines, resources, and project ideas tailored to your goals.
-   **AI Resume Analyzer:** Receive an instant, in-depth analysis of your resume with an overall score, improvement suggestions, and ATS keyword matching.
-   **AI Cover Letter Writer:** Generate compelling, professional cover letters customized for any job application in seconds.
-   **AI Job Matcher:** Upload your resume and let our AI find the most relevant job and internship openings in India.
-   **Kaizen AI Chat:** Get 24/7 career advice from our AI coach on any topic, from interview preparation to salary negotiation.
-   **Interview Practice:** Ace your next interview with AI-powered mock interviews, personalized questions, and real-time feedback.
-   **HR Contact Finder:** Discover relevant HR contacts by department or by analyzing your resume.
-   **Sticky Notes:** A simple and effective tool to organize your daily tasks and boost your productivity.

## Tech Stack

-   **Framework:** Next.js (with App Router)
-   **Language:** TypeScript
-   **Authentication:** Clerk
-   **AI/Generative AI:** Google's Gemini models via Genkit
-   **Styling:** Tailwind CSS
-   **UI Components:** ShadCN
-   **Database/Storage:** Browser `localStorage` for user-generated content like tasks and feedback.

## Getting Started

To get started with the application:

1.  **Sign Up:** Create a free account to access the dashboard.
2.  **Explore the Tools:** Navigate through the sidebar to access the various AI-powered features.
3.  **Generate Content:** Use the tools to create roadmaps, analyze your resume, and generate cover letters. Your activity will be saved in the "History" tab.

### Admin Panel Access

To access the admin panel, you must first assign an "admin" role to your user account via the Clerk dashboard.

1.  Go to your **Clerk Dashboard** -> **Users**.
2.  Select your user and navigate to the **Metadata** section.
3.  In **Public Metadata**, add a new entry with `role` as the key and `admin` as the value.
4.  Log back into the application. The "Admin Panel" link will now be visible in the sidebar.