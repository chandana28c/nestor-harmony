import React, { useMemo, useCallback } from 'react';
import { AnalysisResult, Skill, SkillConfidenceMap, SkillConfidence } from '@/lib/analysisUtils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Trophy, Calendar, CheckSquare, HelpCircle, Copy, Download, Target } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

interface ResultsViewProps {
    result: AnalysisResult;
    onResultChange?: (updated: AnalysisResult) => void;
}

function computeLiveScore(result: AnalysisResult): number {
    const map = result.skillConfidenceMap ?? {};
    if (Object.keys(map).length === 0 && result.extractedSkills.length > 0) {
        return result.readinessScore; // old entry, no self-assessment yet
    }
    const base = result.baseReadinessScore ?? (result.readinessScore + 2 * result.extractedSkills.length);
    let know = 0, practice = 0;
    result.extractedSkills.forEach(s => {
        const v = map[s.name] ?? 'practice';
        if (v === 'know') know++; else practice++;
    });
    const live = base + 2 * know - 2 * practice;
    return Math.max(0, Math.min(100, live));
}

function getSkillConfidence(map: SkillConfidenceMap | undefined, skill: string): SkillConfidence {
    return (map?.[skill] ?? 'practice') as SkillConfidence;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onResultChange }) => {
    const liveScore = useMemo(() => computeLiveScore(result), [result]);

    const handleToggleSkill = useCallback((skill: string) => {
        const map: SkillConfidenceMap = {};
        result.extractedSkills.forEach(s => {
            map[s.name] = (result.skillConfidenceMap?.[s.name] ?? 'practice') as SkillConfidence;
        });
        map[skill] = map[skill] === 'know' ? 'practice' : 'know';
        const know = Object.values(map).filter(v => v === 'know').length;
        const practice = Object.values(map).filter(v => v === 'practice').length;
        const base = result.baseReadinessScore ?? (result.readinessScore + 2 * result.extractedSkills.length);
        const newScore = Math.max(0, Math.min(100, base + 2 * know - 2 * practice));
        const updated: AnalysisResult = {
            ...result,
            skillConfidenceMap: map,
            readinessScore: newScore,
            baseReadinessScore: result.baseReadinessScore ?? base
        };
        onResultChange?.(updated);
    }, [result, onResultChange]);

    const formatPlanText = () => result.plan.map(d =>
        `${d.day}: ${d.focus}\n${d.tasks.map(t => `  • ${t}`).join('\n')}`
    ).join('\n\n');
    const formatChecklistText = () => result.checklist.map(r =>
        `${r.roundName}\n${r.topics.map(t => `  • ${t}`).join('\n')}`
    ).join('\n\n');
    const formatQuestionsText = () => result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');

    const copyPlan = () => {
        navigator.clipboard.writeText(formatPlanText());
        toast.success('7-day plan copied to clipboard');
    };
    const copyChecklist = () => {
        navigator.clipboard.writeText(formatChecklistText());
        toast.success('Round checklist copied to clipboard');
    };
    const copyQuestions = () => {
        navigator.clipboard.writeText(formatQuestionsText());
        toast.success('10 questions copied to clipboard');
    };
    const downloadTxt = () => {
        const text = [
            `Readiness Analysis: ${result.role} @ ${result.company}`,
            `Score: ${liveScore}%`,
            '',
            '--- 7-DAY PLAN ---',
            formatPlanText(),
            '',
            '--- ROUND CHECKLIST ---',
            formatChecklistText(),
            '',
            '--- INTERVIEW QUESTIONS ---',
            formatQuestionsText()
        ].join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `readiness-${result.company}-${result.role.replace(/\s+/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded as TXT');
    };

    const weakSkills = useMemo(() => {
        const map = result.skillConfidenceMap ?? {};
        return result.extractedSkills
            .filter(s => (map[s.name] ?? 'practice') === 'practice')
            .slice(0, 3)
            .map(s => s.name);
    }, [result]);

    const skillsByCategory = result.extractedSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
                            <span className="absolute text-3xl font-bold">{liveScore}%</span>
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

            {/* Skills Detected - interactive toggles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Key Skills Extracted
                    </CardTitle>
                    <CardDescription>Toggle &quot;I know this&quot; or &quot;Need practice&quot;. Default: Need practice.</CardDescription>
                </CardHeader>
                <CardContent>
                    {Object.keys(skillsByCategory).length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(skillsByCategory).map(([category, skills]) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => {
                                            const confidence = getSkillConfidence(result.skillConfidenceMap, skill.name);
                                            return (
                                                <Badge
                                                    key={skill.name}
                                                    variant={confidence === 'know' ? 'default' : 'secondary'}
                                                    className="px-3 py-1 cursor-pointer transition-all hover:opacity-90"
                                                    onClick={() => handleToggleSkill(skill.name)}
                                                >
                                                    {skill.name} · {confidence === 'know' ? 'I know this' : 'Need practice'}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            No specific technical keywords detected. Proceeding with General Fresher Stack.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 7-Day Plan + Export */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            7-Day Preparation Plan
                        </CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyPlan}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy 7-day plan
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {result.plan.map((day, idx) => (
                            <div key={idx} className="relative pl-6 border-l-2 border-muted last:border-0 pb-6 last:pb-0">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                                <h4 className="font-semibold text-lg leading-none mb-1">{day.day}: {day.focus}</h4>
                                <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    {day.tasks.map((task, tIdx) => (
                                        <li key={tIdx}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Round-wise Checklist */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-orange-500" />
                            Round-wise Checklist
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={copyChecklist}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {result.checklist.map((round, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`}>
                                    <AccordionTrigger className="font-medium">{round.roundName}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2">
                                            {round.topics.map((topic, tIdx) => (
                                                <li key={tIdx} className="flex items-start gap-2 text-sm">
                                                    <Circle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Interview Questions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-purple-500" />
                            Likely Interview Questions
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={copyQuestions}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {result.questions.map((q, idx) => (
                                <li key={idx} className="bg-muted/50 p-3 rounded-lg text-sm border">
                                    <span className="font-bold text-primary mr-2">Q{idx + 1}.</span>
                                    {q}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Export all */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-base">Export</CardTitle>
                    <CardDescription>Download all sections as a single TXT file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={downloadTxt}>
                        <Download className="h-4 w-4 mr-2" />
                        Download as TXT
                    </Button>
                </CardContent>
            </Card>

            {/* Action Next box */}
            <Card className="bg-muted/30 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-4 w-4 text-primary" />
                        Action Next
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {weakSkills.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Top weak areas (need practice):</p>
                            <div className="flex flex-wrap gap-2">
                                {weakSkills.map(s => (
                                    <Badge key={s} variant="secondary">{s}</Badge>
                                ))}
                            </div>
                            <p className="text-sm font-medium mt-4">Suggested next step: <span className="text-primary">Start Day 1 plan now.</span></p>
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-primary">All skills marked confident. Keep revising — start Day 1 plan to stay sharp.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultsView;
