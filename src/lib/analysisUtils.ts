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

export type SkillConfidence = 'know' | 'practice';
export type SkillConfidenceMap = Record<string, SkillConfidence>;

export interface AnalysisResult {
    id: string;
    createdAt: string;
    company: string;
    role: string;
    jdText: string;
    extractedSkills: Skill[];
    readinessScore: number;
    plan: PlanDay[];
    checklist: ChecklistRound[];
    questions: string[];
    /** User self-assessment: "know" | "practice" per skill. Defaults to "practice". */
    skillConfidenceMap?: SkillConfidenceMap;
    /** Original JD-derived score; used to compute live score with skill adjustments. */
    baseReadinessScore?: number;
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

    // If no skills found, still show "General fresher stack" implies we don't fail, just return empty skills or handle in generation.

    // 2. Readiness Score Calculation
    let score = 35; // Base
    const categoriesPresent = new Set(extractedSkills.map(s => s.category));
    score += categoriesPresent.size * 5; // +5 per category

    // Cap category bonus at 30? logic: 6 categories * 5 = 30. So max bonus is naturally 30.

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

    const skillConfidenceMap: SkillConfidenceMap = {};
    extractedSkills.forEach(s => { skillConfidenceMap[s.name] = 'practice'; });
    const baseScore = score;
    const initialLiveScore = Math.max(0, Math.min(100, baseScore + 2 * 0 - 2 * extractedSkills.length));

    const result: AnalysisResult = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        company: company.trim() || 'Unknown Company',
        role: role.trim() || 'Software Engineer',
        jdText,
        extractedSkills,
        readinessScore: initialLiveScore,
        plan,
        checklist,
        questions,
        skillConfidenceMap,
        baseReadinessScore: baseScore
    };

    return result;
};

const generateChecklist = (skills: Skill[]): ChecklistRound[] => {
    // Helper to get skills by category
    const getSkills = (cat: string) => skills.filter(s => s.category === cat).map(s => s.name);

    const dsaSkills = getSkills('Core CS');
    const langSkills = getSkills('Languages');

    return [
        {
            roundName: "Round 1: Aptitude & Basics",
            topics: [
                "Quantitative Aptitude (Time, Work, Speed, Profit/Loss)",
                "Logical Reasoning (Puzzles, Blood Relations, Series)",
                "Verbal Ability (Reading Comprehension, Grammar)",
                `Basic Programming Output questions (${langSkills.length > 0 ? langSkills.slice(0, 2).join('/') : 'C/Java/Python'})`,
                "Resume Walkthrough Preparation",
                "Email Writing / Basic Communication Check"
            ]
        },
        {
            roundName: "Round 2: DSA & Core CS",
            topics: [
                "Arrays, Strings, and Linked Lists (Must Do)",
                "Stacks, Queues, and Recursion",
                "Time Complexity Analysis (Big O)",
                dsaSkills.length > 0 ? `Revise ${dsaSkills.slice(0, 2).join(', ')}` : "Basic Trees and Graphs",
                "OOP Concepts (Polymorphism, Inheritance, Encapsulation)",
                "Operating Systems: Process vs Thread, Deadlocks"
            ]
        },
        {
            roundName: "Round 3: Technical Interview",
            topics: [
                "Deep dive into Resume Projects",
                `System Design Basics${skills.some(s => s.category === 'Web') ? ' (Web Architecture, API Design)' : ''}`,
                ...skills.slice(0, 3).map(s => `Explain ${s.name} concepts in depth`),
                "Database Normalization & ACID Properties",
                "Live Coding (1-2 medium problems)",
                "Code Quality & Optimization discussion"
            ]
        },
        {
            roundName: "Round 4: Managerial / HR",
            topics: [
                "Why do you want to join this company?",
                "Strengths and Weaknesses (be honest but strategic)",
                "Situation-based questions (STAR method)",
                "Where do you see yourself in 5 years?",
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
    const hasTesting = skills.some(s => s.category === 'Testing');

    return [
        {
            day: "Day 1-2: Basics + Core CS",
            focus: "Strong Foundation",
            tasks: [
                "Revise CS Fundamentals (OS, CN, DBMS)",
                "Practice 20 Aptitude Questions (Time/Work, Profit/Loss)",
                "Review Resume Points - be ready to explain every keyword",
                "Mock Intro Pitch - 'Tell me about yourself'"
            ]
        },
        {
            day: "Day 3-4: DSA + Coding",
            focus: "Problem Solving",
            tasks: [
                "Solve 5 Easy + 3 Medium LeetCode problems",
                "Revise Standard Algorithms (QuickSort, MergeSort, Binary Search)",
                "Implement Basic Data Structures (LinkedList, Stack) from scratch",
                "Time/Space Complexity Analysis drills"
            ]
        },
        {
            day: "Day 5: Project & Stack",
            focus: "Specialization",
            tasks: [
                hasWeb ? "Review React/Node.js Lifecycle & Hooks / API Integration" : "Review Primary Language Standard Library & Collections",
                hasData ? "Practice SQL Queries (Joins, Indexing, Group By)" : "Review Database Normalization & ACID",
                "Deep dive into one complexity in your main project",
                "Prepare answers for 'Challenges faced in project'"
            ]
        },
        {
            day: "Day 6: Mocks & Behavioral",
            focus: "Interview Simulation",
            tasks: [
                "Record yourself answering common HR questions",
                "Peer Mock Interview (or talk to a rubber duck)",
                hasCloud ? "Review Deployment, Docker basics & CI/CD flows" : (hasTesting ? "Review Testing Pyramids & Frameworks" : "Review Unit Testing basics"),
                "Prepare 3 smart questions for the company"
            ]
        },
        {
            day: "Day 7: Revision",
            focus: "Confidence Building",
            tasks: [
                "Review Weak Areas identified in previous days",
                "Read Company Tech Blog/News or About Us page",
                "Rest & Mental Prep - Sleep well",
                "Final Resume Glance & Logistics check"
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
                questions.push("Explain the Virtual DOM and key benefits of React.");
                questions.push("What is the difference between useEffect and useLayoutEffect?");
                questions.push("How do you handle state management in complex apps?");
                break;
            case 'node.js':
            case 'express':
                questions.push("Explain the Event Loop in Node.js.");
                questions.push("Difference between process.nextTick() and setImmediate().");
                break;
            case 'java':
                questions.push("Explain the internal working of HashMap in Java.");
                questions.push("Difference between Abstract Class and Interface.");
                questions.push("What are the new features in Java 8+ (Streams, Lambdas)?");
                break;
            case 'python':
                questions.push("How is memory managed in Python? Explain Garbage Collection.");
                questions.push("Difference between list and tuple.");
                questions.push("Explain decorators and how they work.");
                break;
            case 'sql':
            case 'mysql':
            case 'postgresql':
                questions.push("Explain Indexing and when it helps vs hurts.");
                questions.push("Difference between INNER JOIN and LEFT JOIN.");
                questions.push("How would you optimize a slow query?");
                break;
            case 'mongodb':
            case 'nosql':
                questions.push("Difference between SQL and NoSQL databases.");
                questions.push("Explain Aggregation Pipeline in MongoDB.");
                break;
            case 'javascript':
            case 'typescript':
                questions.push("Explain Closures and Hoisting.");
                questions.push("Difference between == and ===.");
                questions.push("Explain Promises and async/await.");
                break;
            case 'dsa':
            case 'algorithms':
                questions.push("How would you optimize search in a sorted vs unsorted array?");
                questions.push("Explain Dynamic Programming with an example.");
                break;
            case 'aws':
            case 'cloud':
                questions.push("Explain the difference between vertical and horizontal scaling.");
                questions.push("What is a Load Balancer?");
                break;
            case 'docker':
                questions.push("Difference between Docker Image and Container.");
                questions.push("Explain Docker Compose.");
                break;
            case 'rest':
                questions.push("Explain the difference between PUT and PATCH methods.");
                questions.push("What are idempotent methods?");
                break;
            case 'git':
            case 'github':
                questions.push("Difference between git merge and git rebase.");
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
        "What are SOLID principles? Explain with examples.",
        "Describe a time you failed and what you learned.",
        "How do you stay updated with latest technologies?",
        "Explain the CAP theorem in distributed systems."
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
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // Dispatch a custom event to notify listeners (like History page if open)
    window.dispatchEvent(new Event('historyUpdated'));
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

export const updateAnalysis = (result: AnalysisResult) => {
    const history = getHistory();
    const idx = history.findIndex(item => item.id === result.id);
    if (idx >= 0) {
        history[idx] = result;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        window.dispatchEvent(new Event('historyUpdated'));
    }
};
