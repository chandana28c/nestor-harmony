
import React, { useCallback, useMemo } from 'react';
import { AnalysisResult, updateAnalysis } from '@/lib/analysisUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Download, BookOpen, Trophy, Target, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ResultsViewProps {
    result: AnalysisResult;
    onResultChange?: (updated: AnalysisResult) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onResultChange }) => {

    // Use the finalScore from the result directly
    const liveScore = result.finalScore || 0;

    const handleToggleSkill = useCallback((skillName: string) => {
        const map = { ...result.skillConfidenceMap };
        const current = map[skillName] || 'practice';
        const next = current === 'know' ? 'practice' : 'know';
        map[skillName] = next;

        // Recalculate Score
        // Logic: Base Score - 2 * (total skills - known skills) 
        // OR: Base Score - 2 * practice count.
        // Wait, standard logic in analysisUtils was: Math.max(0, Math.min(100, baseScore - 2 * totalSkillCount)); // Initial
        // If I toggle one to know, it should essentially be +2.

        // Let's replicate the logic:
        // Score = BaseScore + (2 * Know) - (2 * Practice)
        // Check analysisUtils logic:
        // Initial was: baseScore - 2 * total. (Assuming 0 know, all practice).
        // Correct formula to match that:
        // Score = baseScore - 2 * practiceCount + 2 * knowCount? NO.
        // If all practice: base - 2*total.
        // If all know: base + 2*total. 
        // Difference is 4*total which is huge.

        // Let's stick to the user rule: "baseReadinessScore + 2 * (skills marked 'know') - 2 * (skills marked 'need practice')"

        const allSkillsIs = Object.values(result.extractedSkills).flat();
        let know = 0;
        let practice = 0;

        allSkillsIs.forEach(s => {
            const v = map[s] || 'practice';
            if (v === 'know') know++; else practice++;
        });

        // Ensure baseScore exists, default to 35 if missing
        const base = result.baseScore || 35;
        const newScore = Math.max(0, Math.min(100, base + 2 * know - 2 * practice));

        const updated: AnalysisResult = {
            ...result,
            skillConfidenceMap: map,
            finalScore: newScore,
            updatedAt: new Date().toISOString()
        };
        onResultChange?.(updated);
    }, [result, onResultChange]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const downloadTxt = () => {
        const content = `
ANALYSIS REPORT FOR ${result.role} @ ${result.company}
Date: ${new Date(result.createdAt).toLocaleDateString()}
Score: ${liveScore}/100

SKILLS IDENTIFIED:
${Object.entries(result.extractedSkills).map(([cat, skills]) =>
            skills.length > 0 ? `${cat.toUpperCase()}: ${skills.join(', ')}` : ''
        ).filter(Boolean).join('\n')}

7-DAY PLAN:
${result.plan.map(p => `[${p.day}] ${p.focus}\n${p.tasks.map(t => ` - ${t}`).join('\n')}`).join('\n\n')}

CHECKLIST Rounds:
${result.checklist.map(r => `${r.roundName}:\n${r.topics.map(t => ` - ${t}`).join('\n')}`).join('\n\n')}

INTERVIEW QUESTIONS:
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nestor_plan_${result.company || 'general'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Flatten skills for display
    const allSkills = useMemo(() => Object.values(result.extractedSkills).flat(), [result.extractedSkills]);
    const weakSkills = allSkills.filter(s => (result.skillConfidenceMap[s] || 'practice') === 'practice');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header with live score */}
            <Card className="md:col-span-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Trophy className="h-6 w-6 text-primary" />
                        Readiness Analysis
                    </CardTitle>
                    <CardDescription className="text-lg">
                        {result.role} @ {result.company}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative h-32 w-32 flex items-center justify-center">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                                    strokeDasharray={`${liveScore * 2.51} 251.2`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-3xl font-bold">{Math.round(liveScore)}%</span>
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-semibold">
                                {liveScore >= 80 ? "Excellent Match!" :
                                    liveScore >= 50 ? "Good Potential" : "Needs Preparation"}
                            </h3>
                            <p className="text-muted-foreground">
                                Based on your JD and self-assessment. Toggle skills below to update your score.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Intel & Round Mapping */}
            {result.companyIntel && (
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 border-blue-500/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Company Intel
                            </CardTitle>
                            <CardDescription>AI-driven insights (Demo Mode)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Size Category</h4>
                                <Badge variant={result.companyIntel.size === 'Enterprise' ? 'default' : 'secondary'} className="mt-1">
                                    {result.companyIntel.size}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Likely Industry</h4>
                                <p className="font-medium text-foreground">{result.companyIntel.industry}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Hiring DNA</h4>
                                <p className="text-sm italic text-foreground/80">"{result.companyIntel.hiringFocus}"</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                Expected Interview Roadmap
                            </CardTitle>
                            <CardDescription>Based on company size ({result.companyIntel.size}) and role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l-2 border-muted ml-3 space-y-8 py-2">
                                {result.roundMapping?.map((round, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary ring-2 ring-background" />
                                        <h4 className="font-semibold text-base text-primary">{round.stage}: {round.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-xl">{round.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Skills Detected - interactive toggles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Skill Analysis & Confidence
                    </CardTitle>
                    <CardDescription>
                        Click skills to toggle between "Need Practice" (Gray) and "I Know This" (Green).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {allSkills.length === 0 ? (
                        <p className="text-muted-foreground">No specific skills detected. Focus on fundamentals.</p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(result.extractedSkills).map(([category, skills]) => (
                                skills.length > 0 && (
                                    <div key={category}>
                                        <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">{category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(skill => {
                                                const status = result.skillConfidenceMap[skill] || 'practice';
                                                return (
                                                    <Badge
                                                        key={skill}
                                                        variant={status === 'know' ? 'default' : 'outline'}
                                                        className={`cursor-pointer select-none transition-all ${status === 'know' ? 'bg-green-600 hover:bg-green-700' : 'text-muted-foreground'}`}
                                                        onClick={() => handleToggleSkill(skill)}
                                                    >
                                                        {skill}
                                                        {status === 'know' && <CheckCircle2 className="ml-1 h-3 w-3" />}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* 7 Day Plan */}
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>7-Day Preparation Plan</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.plan.map(p => `${p.day}: ${p.focus}`).join('\n'), 'Plan')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {result.plan.map((day, idx) => (
                            <div key={idx} className="border-l-2 border-primary/20 pl-4">
                                <h4 className="font-semibold text-primary">{day.day}: {day.focus}</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                    {day.tasks.map((task, i) => (
                                        <li key={i}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Checklist */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Round-wise Checklist</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(result.checklist, null, 2), 'Checklist')}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {result.checklist.map((round, idx) => (
                                <div key={idx}>
                                    <h4 className="font-medium text-sm border-b pb-1 mb-2">{round.roundName}</h4>
                                    <ul className="space-y-1">
                                        {round.topics.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Questions */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Top Interview Questions</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.questions.join('\n'), 'Questions')}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-decimal list-inside space-y-2 text-sm">
                                {result.questions.slice(0, 5).map((q, i) => (
                                    <li key={i} className="text-muted-foreground">{q}</li>
                                ))}
                            </ul>
                            {result.questions.length > 5 && (
                                <p className="text-xs text-center text-muted-foreground mt-2 italic">
                                    + {result.questions.length - 5} more questions in export
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Action Area */}
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">Ready to start?</h3>
                    <p className="text-sm text-muted-foreground">
                        {weakSkills.length > 0
                            ? `You have ${weakSkills.length} skills to practice, starting with ${weakSkills[0]}.`
                            : "You are looking solid! Start with Day 1 plan."}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={downloadTxt}>
                        <Download className="mr-2 h-4 w-4" /> Download Plan
                    </Button>
                    <Button onClick={() => window.print()}>
                        Start Day 1 <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;
