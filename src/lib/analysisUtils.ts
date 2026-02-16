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

export interface CompanyIntel {
    name: string;
    industry: string;
    size: 'Startup' | 'Mid-size' | 'Enterprise';
    hiringFocus: string;
}

export interface RoundStep {
    stage: string;
    name: string;
    description: string;
}

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
    /** Heuristic company intelligence */
    companyIntel?: CompanyIntel;
    /** Predicted interview rounds */
    roundMapping?: RoundStep[];
}

const SKILL_KEYWORDS: Record<string, string[]> = {
    'Core CS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented', 'DBMS', 'Database Management', 'OS', 'Operating Systems', 'Networks', 'Computer Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Sass', 'Less', 'REST', 'GraphQL', 'API'],
    'Data': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Cassandra', 'Oracle', 'SQLite', 'Firebase', 'Supabase'],
    'Cloud/DevOps': ['AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Linux', 'Bash', 'Shell'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'Chai', 'JUnit', 'PyTest', 'TestNG']
};

const KNOWN_GIANTS = [
    'google', 'amazon', 'microsoft', 'meta', 'facebook', 'apple', 'netflix',
    'tcs', 'infosys', 'wipro', 'hcl', 'accenture', 'capgemini', 'cognizant',
    'ibm', 'oracle', 'cisco', 'intel', 'adobe', 'salesforce', 'sap', 'dell',
    'hp', 'lenovo', 'samsung', 'flipkart', 'uber', 'ola', 'swiggy', 'zomato',
    'paytm', 'phonepe', 'walmart', 'target', 'goldman sachs', 'jpmorgan',
    'morgan stanley', 'wells fargo', 'american express'
];

export const analyzeJD = (jdText: string, company: string = '', role: string = ''): AnalysisResult => {
    const extractedSkills: Skill[] = [];
    const lowerJD = jdText.toLowerCase();

    // 1. Skill Extraction
    Object.entries(SKILL_KEYWORDS).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(lowerJD)) {
                if (!extractedSkills.some(s => s.name === keyword)) {
                    extractedSkills.push({ name: keyword, category: category as any });
                }
            }
        });
    });

    // 2. Readiness Score Calculation
    let score = 35; // Base
    const categoriesPresent = new Set(extractedSkills.map(s => s.category));
    score += categoriesPresent.size * 5; // +5 per category

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

    // 6. Generate Company Intel & Rounds
    const companyIntel = generateCompanyIntel(company, role);
    const roundMapping = generateRoundMapping(companyIntel.size, extractedSkills);

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
        baseReadinessScore: baseScore,
        companyIntel,
        roundMapping
    };

    return result;
};

const generateCompanyIntel = (company: string, role: string): CompanyIntel => {
    const lowerName = company.toLowerCase();
    const isGiant = KNOWN_GIANTS.some(giant => lowerName.includes(giant));

    // Heuristic Industry Guess
    let industry = "Technology Services";
    if (lowerName.includes('bank') || lowerName.includes('financial') || lowerName.includes('capital')) industry = "Banking & Finance";
    else if (lowerName.includes('health') || lowerName.includes('pharma')) industry = "Healthcare Tech";
    else if (lowerName.includes('retail') || lowerName.includes('commerce')) industry = "E-Commerce / Retail";
    else if (lowerName.includes('auto') || lowerName.includes('motor')) industry = "Automotive Tech";

    if (isGiant) {
        return {
            name: company,
            industry,
            size: 'Enterprise',
            hiringFocus: "Strong emphasis on DSA, CS Fundamentals, and scalable system design. Expect standardized processes."
        };
    } else {
        return {
            name: company,
            industry,
            size: 'Startup', // Default for unknown
            hiringFocus: "Speed of delivery, practical problem solving, and immediate stack utility. Culture fit is crucial."
        };
    }
};

const generateRoundMapping = (size: 'Startup' | 'Mid-size' | 'Enterprise', skills: Skill[]): RoundStep[] => {
    const hasDSA = skills.some(s => s.category === 'Core CS');
    const hasWeb = skills.some(s => s.category === 'Web');

    if (size === 'Enterprise') {
        return [
            { stage: "Round 1", name: "Online Assessment", description: "Automated test on HackerRank/Mettl. Expect 2 DSA questions (Arrays/Strings) + 20 Aptitude MCQs." },
            { stage: "Round 2", name: "Technical Interview 1", description: "DSA-heavy. Live coding of standard algorithms (Trees, Graphs, DP). Deep dive into Time Complexity." },
            { stage: "Round 3", name: "Technical Interview 2", description: `${hasWeb ? 'System Design & Projects' : 'Core CS & Low Level Design'}. Discussion on your resume projects and DB schema design.` },
            { stage: "Round 4", name: "Managerial / HR", description: "Behavioral alignment. Questions on longevity, relocation, and 'Why this company?'." }
        ];
    } else {
        // Startup / Mid-size
        return [
            { stage: "Round 1", name: "Screening / Assignment", description: "Likely a take-home assignment or a practical pair-programming session. focus on clean code and functionality." },
            { stage: "Round 2", name: "Technical Deep Dive", description: `Discussions on ${hasWeb ? 'React/Node patterns' : 'Development frameworks'}, async programming, and API design. Whiteboarding a feature.` },
            { stage: "Round 3", name: "Culture Fit & Founder", description: "Discussion on product vision, your adaptability, and 'wearing multiple hats'. Be ready to show passion." }
        ];
    }
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
    const found = history.find(item => item.id === id);

    // Legacy Data Hydration: If old analysis lacks intel, generate it on the fly
    if (found && !found.companyIntel) {
        found.companyIntel = generateCompanyIntel(found.company || '', found.role || '');
        found.roundMapping = generateRoundMapping(found.companyIntel.size, found.extractedSkills || []);
    }

    return found;
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
