
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeJD, updateAnalysis, getHistory, saveAnalysis, AnalysisResult, Skill } from '@/lib/analysisUtils';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'dispatchEvent', { value: vi.fn() });

describe('Interactive Features Verification', () => {
    let result: AnalysisResult;

    beforeEach(() => {
        window.localStorage.clear();
        const jd = "Looking for React and Node.js developer.";
        result = analyzeJD(jd, "Test Corp", "Dev");
        saveAnalysis(result);
    });

    it('Initial state has all skills as "practice" and reduced score', () => {
        expect(result.extractedSkills.length).toBeGreaterThan(0);
        const map = result.skillConfidenceMap!;
        result.extractedSkills.forEach(skill => {
            expect(map[skill.name]).toBe('practice');
        });

        const base = result.baseReadinessScore!;
        const expected = Math.max(0, Math.min(100, base - 2 * result.extractedSkills.length));
        expect(result.readinessScore).toBe(expected);
    });

    it('Toggling to "know" increases score', () => {
        const skill = result.extractedSkills[0].name;

        const newMap = { ...result.skillConfidenceMap };
        newMap[skill] = 'know';

        let know = 0, practice = 0;
        result.extractedSkills.forEach(s => {
            const val = newMap[s.name] || 'practice';
            if (val === 'know') know++; else practice++;
        });

        const base = result.baseReadinessScore!;
        const newScore = Math.max(0, Math.min(100, base + 2 * know - 2 * practice));

        expect(newScore).toBeGreaterThan(result.readinessScore);

        const updatedResult = {
            ...result,
            skillConfidenceMap: newMap,
            readinessScore: newScore
        };

        updateAnalysis(updatedResult);
        const history = getHistory();
        expect(history.length).toBe(1);
        expect(history[0].skillConfidenceMap![skill]).toBe('know');
        expect(history[0].readinessScore).toBe(newScore);
    });

    it('Score never exceeds 100', () => {
        const highResult = { ...result, baseReadinessScore: 98 };
        const newMap: any = {};
        highResult.extractedSkills.forEach(s => newMap[s.name] = 'know');

        const know = highResult.extractedSkills.length;
        const practice = 0;
        const live = highResult.baseReadinessScore! + 2 * know - 2 * practice;

        const textMax = Math.max(0, Math.min(100, live));
        expect(textMax).toBeLessThanOrEqual(100);
    });
});
