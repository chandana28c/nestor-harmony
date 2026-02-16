
import { describe, it, expect } from 'vitest';
import { analyzeJD } from '@/lib/analysisUtils';

describe('Company Intel & Round Mapping', () => {

    it('Classifies known giants as Enterprise', () => {
        const result = analyzeJD("Java JD", "Amazon Web Services", "SDE");
        expect(result.companyIntel).toBeDefined();
        expect(result.companyIntel?.size).toBe('Enterprise');
        expect(result.companyIntel?.hiringFocus).toContain('DSA');
    });

    it('Classifies unknown companies as Startup by default', () => {
        const result = analyzeJD("React JD", "Random Startup 123", "Frontend Dev");
        expect(result.companyIntel).toBeDefined();
        expect(result.companyIntel?.size).toBe('Startup');
        expect(result.companyIntel?.hiringFocus).toContain('practical');
    });

    it('Generates DSA-heavy rounds for Enterprise', () => {
        const result = analyzeJD("Java JD", "Google", "SDE");
        const rounds = result.roundMapping;
        expect(rounds).toBeDefined();
        expect(rounds?.[0].name).toContain('Online Assessment');
        expect(rounds?.[1].name).toContain('Technical Interview');
    });

    it('Generates Practical rounds for Startup', () => {
        const result = analyzeJD("React JD", "Cool App Inc", "Dev");
        const rounds = result.roundMapping;
        expect(rounds).toBeDefined();
        expect(rounds?.[0].name).toContain('Screening');
    });

    it('Adapts round content based on skills (Web vs Core)', () => {
        // Startup with React -> Web Deep Dive
        const webResult = analyzeJD("React developer", "Startup A", "Dev");
        const webRound2 = webResult.roundMapping?.[1].description;
        expect(webRound2).toContain('React');

        // Startup with only Java -> Development frameworks (generic)
        const javaResult = analyzeJD("Java developer", "Startup B", "Dev");
        const javaRound2 = javaResult.roundMapping?.[1].description;
        expect(javaRound2).toContain('Development frameworks');
    });
});
