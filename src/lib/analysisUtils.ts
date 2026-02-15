import { v4 as uuidv4 } from 'uuid';

export interface Skill {
    name: string;
    category: 'Core CS' | 'Languages' | 'Web' | 'Data' | 'Cloud/DevOps' | 'Testing';
}

export interface PlanDay {
    day: string;
    focus: string;
    tasks: string[];
}

export interface ChecklistRound {
    roundName: string;
    topics: string[];
}

export interface AnalysisResult {
    id: string;
    createdAt: string; // ISO string
    company: string;
    role: string;
    jdText: string;
    extractedSkills: Skill[];
    readinessScore: number;
    plan: PlanDay[];
    checklist: ChecklistRound[];
    questions: string[];
}

const SKILL_KEYWORDS: Record<string, string[]> = {
    'Core CS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented', 'DBMS', 'Database Management', 'OS', 'Operating Systems', 'Networks', 'Computer Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Sass', 'Less', 'REST', 'GraphQL', 'API'],
    'Data': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Cassandra', 'Oracle', 'SQLite', 'Firebase', 'Supabase'],
    'Cloud/DevOps': ['AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Linux', 'Bash', 'Shell'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'Chai', 'JUnit', 'PyTest', 'TestNG']
};

export const analyzeJD = (jdText: string, company: string = '', role: string = ''): AnalysisResult => {
    const extractedSkills: Skill[] = [];
    const lowerJD = jdText.toLowerCase();

    // 1. Skill Extraction
    Object.entries(SKILL_KEYWORDS).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
            // Use word boundary to avoid partial matches (e.g., "Go" in "Google")
            // Escape special characters in keyword if any (simple approach for now)
            const regex = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(lowerJD)) {
                // Check if already added to avoid duplicates
                if (!extractedSkills.some(s => s.name === keyword)) {
                    extractedSkills.push({ name: keyword, category: category as any });
                }
            }
        });
    });

    // If no skills found, add a general fallback or handle externally.
    // Requirement says: "If JD includes none, still show 'General fresher stack'." 
    // We'll handle this in the UI or generators, but having an empty list is valid state.

    // 2. Readiness Score Calculation
    let score = 35; // Base
    const categoriesPresent = new Set(extractedSkills.map(s => s.category));
    score += categoriesPresent.size * 5; // +5 per category
    if (score > 35 + (6 * 5)) score = 35 + 30; // Max category bonus is 30? Wait. "Max 30" -> yes. 6 cats * 5 = 30.

    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;

    if (score > 100) score = 100;

    // 3. Generate Checklist
    const checklist = generateChecklist(extractedSkills);

    // 4. Generate 7-Day Plan
    const plan = generatePlan(extractedSkills);

    // 5. Generate Questions
    const questions = generateQuestions(extractedSkills);

    const result: AnalysisResult = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        company: company.trim() || 'Unknown Company',
        role: role.trim() || 'Software Engineer',
        jdText,
        extractedSkills,
        readinessScore: score,
        plan,
        checklist,
        questions
    };

    // Save automatically? The prompt says "On Analyze, store an entry".
    // We can call save here or let the UI call it. Let's provide a save function and call it from the UI.
    // Actually, let's keep this pure and return the result.
    return result;
};

const generateChecklist = (skills: Skill[]): ChecklistRound[] => {
    // Template-based rounds
    return [
        {
            roundName: "Round 1: Aptitude & Basics",
            topics: [
                "Quantitative Aptitude (Time, Work, Speed)",
                "Logical Reasoning (Puzzles, Series)",
                "Verbal Ability (Reading Comprehension)",
                "Basic Programming Output questions (C/Java/Python)",
                "Resume Walkthrough Preparation"
            ]
        },
        {
            roundName: "Round 2: DSA & Core CS",
            topics: [
                "Arrays, Strings, and Linked Lists",
                "Stacks, Queues, and Recursion",
                "Time Complexity Analysis (Big O)",
                "Basic Trees and Graphs",
                "OOP Concepts (Polymorphism, Inheritance)"
            ]
        },
        {
            roundName: "Round 3: Technical Interview",
            topics: [
                "Deep dive into Projects",
                `System Design Basics${skills.some(s => s.category === 'Web') ? ' (Web Architecture)' : ''}`,
                ...skills.slice(0, 3).map(s => `Explain ${s.name} concepts in depth`),
                "Database Normalization & ACID Properties",
                "Live Coding (1-2 medium problems)"
            ]
        },
        {
            roundName: "Round 4: Managerial / HR",
            topics: [
                "Why this company?",
                "Strengths and Weaknesses",
                "Situation-based questions (STAR method)",
                "Salary expectations & Negotiation",
                "Questions for the interviewer"
            ]
        }
    ];
};

const generatePlan = (skills: Skill[]): PlanDay[] => {
    const hasWeb = skills.some(s => s.category === 'Web');
    const hasData = skills.some(s => s.category === 'Data');
    const hasCloud = skills.some(s => s.category === 'Cloud/DevOps');

    return [
        {
            day: "Day 1-2: Basics + Core CS",
            focus: "Strong Foundation",
            tasks: [
                "Revise CS Fundamentals (OS, CN, DBMS)",
                "Practice 20 Aptitude Questions",
                "Review Resume Points",
                "Mock Intro Pitch"
            ]
        },
        {
            day: "Day 3-4: DSA + Coding",
            focus: "Problem Solving",
            tasks: [
                "Solve 5 Easy + 3 Medium LeetCode problems",
                "Revise Standard Algorithms (Sorting, Searching)",
                "Implement Basic Data Structures from scratch",
                "Time/Space Complexity Analysis drills"
            ]
        },
        {
            day: "Day 5: Projects & Stack",
            focus: "Specialization",
            tasks: [
                hasWeb ? "Review React/Node.js Lifecycle & Hooks" : "Review Primary Language Standard Library",
                hasData ? "Practice SQL Queries (Joins, Indexing)" : "Review Database Concepts",
                "Deep dive into one complexity in your main project",
                "Prepare answers for 'Challenges faced'"
            ]
        },
        {
            day: "Day 6: Mocks & Behavioral",
            focus: "Interview Simulation",
            tasks: [
                "Record yourself answering common HR questions",
                "Peer Mock Interview",
                hasCloud ? "Review Deployment & CI/CD flows" : "Review Testing basics",
                "Prepare questions for the company"
            ]
        },
        {
            day: "Day 7: Revision",
            focus: "Confidence Building",
            tasks: [
                "Review Weak Areas from previous days",
                "Read Company Tech Blog/News",
                "Rest & Mental Prep",
                "Final Resume Glance"
            ]
        }
    ];
};

const generateQuestions = (skills: Skill[]): string[] => {
    const questions: string[] = [];

    // Specific skill-based questions
    skills.forEach(skill => {
        if (questions.length >= 10) return;

        switch (skill.name.toLowerCase()) {
            case 'react':
            case 'next.js':
                questions.push("Explain the Virtual DOM and Reconciliation process.");
                questions.push("What is the difference between specialized Hooks and regular functions?");
                break;
            case 'java':
                questions.push("Explain the internal working of HashMap in Java.");
                questions.push("Difference between Abstract Class and Interface."); // Classic
                break;
            case 'python':
                questions.push("How is memory managed in Python? Explain Garbage Collection.");
                questions.push("Difference between list and tuple.");
                break;
            case 'sql':
            case 'mysql':
            case 'postgresql':
                questions.push("Explain Indexing and how it improves query performance.");
                questions.push("What are ACID properties? Explain with examples.");
                break;
            case 'javascript':
            case 'typescript':
                questions.push("Explain Event Loop and closures.");
                questions.push("Difference between == and ===.");
                break;
            case 'dsa':
            case 'algorithms':
                questions.push("How would you optimize search in a sorted vs unsorted array?");
                break;
            case 'aws':
            case 'cloud':
                questions.push("Explain the difference between vertical and horizontal scaling.");
                break;
            case 'docker':
                questions.push("Difference between Docker Image and Container.");
                break;
            case 'rest':
                questions.push("Explain the difference between PUT and PATCH methods.");
                break;
            default:
                // Generic for the category if not specific
                break;
        }
    });

    // Fill remaining with generic high-quality questions
    const genericQuestions = [
        "Tell me about a challenging bug you fixed.",
        "How do you handle conflicts in a team?",
        "Explain a project where you had to learn a new technology.",
        "What is your approach to debugging a slow application?",
        "Explain the request-response cycle of a web application.",
        "What are SOLID principles?",
        "Describe a time you failed and what you learned."
    ];

    let i = 0;
    while (questions.length < 10 && i < genericQuestions.length) {
        if (!questions.includes(genericQuestions[i])) {
            questions.push(genericQuestions[i]);
        }
        i++;
    }

    return questions.slice(0, 10);
};

// Storage Utilities
const STORAGE_KEY = 'placement_history';

export const saveAnalysis = (result: AnalysisResult) => {
    const history = getHistory();
    history.unshift(result); // Add to top
    // Limit history if needed? User didn't specify. Let's keep it unbounded for now or cap at 50 safely.
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): AnalysisResult[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
};

export const getAnalysis = (id: string): AnalysisResult | undefined => {
    const history = getHistory();
    return history.find(item => item.id === id);
};
