import { describe, it, expect } from 'vitest';
import { analyzeJD } from '../lib/analysisUtils';

describe('Placement Analysis Logic', () => {
    it('should extract skills correctly', () => {
        const jd = `
      We are looking for a React Developer with experience in TypeScript and Node.js.
      Knowledge of AWS and Docker is a plus.
      Must know Data Structures and Algorithms.
    `;

        const result = analyzeJD(jd, 'TechCorp', 'Frontend Dev');

        const skillNames = result.extractedSkills.map(s => s.name);

        expect(skillNames).toContain('React');
        expect(skillNames).toContain('TypeScript');
        expect(skillNames).toContain('Node.js');
        expect(skillNames).toContain('AWS');
        expect(skillNames).toContain('Docker');
        expect(skillNames).toContain('Data Structures');
        expect(skillNames).toContain('Algorithms');
    });

    it('should calculate score correctly', () => {
        // Base 35
        // Categories detected: Web (React, Node), Languages (TS), Cloud (AWS, Docker), Core CS (DSA)
        // 4 categories * 5 = 20
        // Company provided (+10)
        // Role provided (+10)
        // Length < 800 (0)
        // Total expected: 35 + 20 + 20 = 75

        const jd = `
      React TypeScript Node.js AWS Docker Data Structures
    `;
        const result = analyzeJD(jd, 'C', 'R');

        // Extracted Skills:
        // React (Web)
        // TypeScript (Languages)
        // Node.js (Web)
        // AWS (Cloud)
        // Docker (Cloud)
        // Data Structures (Core CS)
        // Categories: Web, Languages, Cloud, Core CS = 4 unique categories.

        const expectedScore = 35 + (4 * 5) + 10 + 10;
        expect(result.readinessScore).toBe(expectedScore);
    });

    it('should generate specific questions', () => {
        const jd = "Looking for a SQL expert.";
        const result = analyzeJD(jd);

        const hasSQLQuestion = result.questions.some(q => q.includes("Indexing") || q.includes("ACID"));
        expect(hasSQLQuestion).toBe(true);
    });
});
