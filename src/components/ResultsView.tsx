import React from 'react';
import { AnalysisResult, PlanDay, ChecklistRound, Skill } from '@/lib/analysisUtils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Circle, Trophy, Calendar, CheckSquare, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ResultsViewProps {
    result: AnalysisResult;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
    // Group skills by category
    const skillsByCategory = result.extractedSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="grid gap-6 md:grid-cols-2">
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
                                {/* Circular Progress Placeholder - using simple div for now or we can use SVG */}
                                <div className="absolute inset-0 rounded-full border-8 border-muted opacity-20"></div>
                                <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow" style={{ transform: `rotate(${result.readinessScore * 3.6}deg)` }}></div>
                                {/* Better approach: SVG Circle */}
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                                        strokeDasharray={`${result.readinessScore * 2.51} 251.2`} strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-3xl font-bold">{result.readinessScore}%</span>
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h3 className="text-xl font-semibold">
                                    {result.readinessScore >= 80 ? "Excellent Match!" :
                                        result.readinessScore >= 50 ? "Good Potential" : "Needs Preparation"}
                                </h3>
                                <p className="text-muted-foreground">
                                    Based on your JD, we've identified {result.extractedSkills.length} key skills and generated a tailored preparation plan.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skills Detected */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Detected Skills
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {Object.keys(skillsByCategory).length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(skillsByCategory).map(([category, skills]) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))}
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

            {/* 7-Day Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        7-Day Preparation Plan
                    </CardTitle>
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-orange-500" />
                            Round-wise Checklist
                        </CardTitle>
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-purple-500" />
                            Likely Interview Questions
                        </CardTitle>
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
        </div>
    );
};

export default ResultsView;
