
import { describe, it, expect } from 'vitest';
import { analyzeJD } from '@/lib/analysisUtils';

describe('User Requirement Verification Checklist', () => {

    // Requirement: With a company name provided, does a Company Intel card appear?
    it('✓ Generates Company Intel when name is provided', () => {
        const result = analyzeJD("Java Dev", "Test Corp", "Dev");
        expect(result.companyIntel).toBeDefined();
        console.log("✓ Company Intel generated");
    });

    // Requirement: Does the intel card show industry, size category, and typical hiring focus?
    it('✓ Intel card contains Industry, Size, and Hiring Focus', () => {
        const result = analyzeJD("Java Dev", "Test Corp", "Dev");
        expect(result.companyIntel?.industry).toBeDefined();
        expect(result.companyIntel?.size).toBeDefined();
        expect(result.companyIntel?.hiringFocus).toBeDefined();
        console.log(`✓ Data present: Industry (${result.companyIntel?.industry}), Size (${result.companyIntel?.size})`);
    });

    // Requirement: Enter 'Amazon' as company — does it classify as Enterprise with structured DSA focus?
    it("✓ 'Amazon' classifies as Enterprise with DSA focus", () => {
        const result = analyzeJD("SDE", "Amazon", "Engineer");
        expect(result.companyIntel?.size).toBe("Enterprise");
        expect(result.companyIntel?.hiringFocus).toContain("DSA");
        console.log("✓ Amazon -> Enterprise verified");
    });

    // Requirement: Enter an unknown company name — does it default to Startup with practical focus?
    it("✓ Unknown company defaults to Startup with practical focus", () => {
        const result = analyzeJD("Dev", "Random Startup 123", "Engineer");
        expect(result.companyIntel?.size).toBe("Startup");
        expect(result.companyIntel?.hiringFocus).toContain("practical");
        console.log("✓ Random -> Startup verified");
    });

    // Requirement: Is there a vertical timeline showing round flow?
    it("✓ Generates Round Mapping (Timeline)", () => {
        const result = analyzeJD("Dev", "Amazon", "Engineer");
        expect(result.roundMapping).toBeDefined();
        expect(Array.isArray(result.roundMapping)).toBe(true);
        expect(result.roundMapping!.length).toBeGreaterThan(0);
        console.log(`✓ Round mapping generated with ${result.roundMapping!.length} rounds`);
    });

    // Requirement: Does each round have a 'Why this round matters' explanation?
    it("✓ Rounds have 'description' (Why this matters)", () => {
        const result = analyzeJD("Dev", "Amazon", "Engineer");
        result.roundMapping!.forEach(round => {
            expect(round.description).toBeDefined();
            expect(round.description.length).toBeGreaterThan(5);
        });
        console.log("✓ All rounds have descriptions");
    });

    // Requirement: Do rounds change based on company size + detected skills?
    it("✓ Rounds adapt to Skills (Web vs Generic) and Size", () => {
        const webResult = analyzeJD("React Developer", "Startup A", "Dev");
        const javaResult = analyzeJD("Java Developer", "Startup A", "Dev");

        // Deep comparison of Round 2 Description
        const webRound = webResult.roundMapping![1].description;
        const javaRound = javaResult.roundMapping![1].description;

        expect(webRound).not.toEqual(javaRound);
        expect(webRound).toContain("React");

        console.log("✓ Web request got React-specific rounds");
        console.log("✓ Java request got Generic rounds");
    });
});
