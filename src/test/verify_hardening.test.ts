
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeJD, getHistory, saveAnalysis, AnalysisResult, ExtractedSkills } from '@/lib/analysisUtils';

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

describe('Hardening Verification', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('✓ Schema: analyzeJD returns correct strict structure', () => {
        const result = analyzeJD("Java Developer needed", "Test Corp", "Dev");

        expect(result.extractedSkills).toBeDefined();
        // Check strict schema keys
        expect(Array.isArray(result.extractedSkills.coreCS)).toBe(true);
        expect(Array.isArray(result.extractedSkills.languages)).toBe(true); // Should contain Java
        expect(result.extractedSkills.languages).toContain("Java");
        expect(result.finalScore).toBeDefined();
        expect(typeof result.finalScore).toBe('number');
    });

    it('✓ Edge Case: No skills detected triggers fallback', () => {
        const result = analyzeJD("Looking for someone who is good at stuff.", "Unknown", "Role");

        // Should have 0 extracted real skills
        const totalReal = Object.values(result.extractedSkills).flat().length;

        // But logic says: if totalSkillCount == 0 -> populate 'other'
        // Let's check 'other'
        expect(result.extractedSkills.other.length).toBeGreaterThan(0);
        expect(result.extractedSkills.other).toContain("Communication");
        console.log(`✓ Fallback triggered. Other skills: ${result.extractedSkills.other.join(', ')}`);
    });

    it('✓ History Robustness: Skips corrupted entries', () => {
        // manually inject bad data
        const badData = [
            { id: "1", valid: "maybe" }, // Missing everything
            { id: "2", extractedSkills: [] } // Old schema (array)
        ];
        window.localStorage.setItem('placement_history', JSON.stringify(badData));

        const history = getHistory();
        expect(history.length).toBe(0);
        console.log("✓ Corrupted entries validly ignored.");
    });

    it('✓ Persistence: Saves and Loads valid data', () => {
        const result = analyzeJD("Java", "Corp", "Role");
        saveAnalysis(result);

        const history = getHistory();
        expect(history.length).toBe(1);
        expect(history[0].id).toBe(result.id);
        console.log("✓ Valid data persisted correctly.");
    });
});
