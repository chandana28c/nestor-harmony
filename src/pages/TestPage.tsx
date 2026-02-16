
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck, Lock, Unlock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'prp_test_checklist';

const TEST_ITEMS = [
    { id: 'jd_validation', label: 'JD required validation works', hint: 'Try analyzing with empty JD. Should see red warning.' },
    { id: 'short_jd_warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste a short text (e.g. "Java dev needed"). Warning should appear.' },
    { id: 'skills_grouping', label: 'Skills extraction groups correctly', hint: 'Check if Java appears in Languages, React in Web, etc.' },
    { id: 'round_mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare Amazon (Enterprise) vs Unknown (Startup) rounds.' },
    { id: 'deterministic_score', label: 'Score calculation is deterministic', hint: 'Same JD should give same base score every time.' },
    { id: 'live_score_toggle', label: 'Skill toggles update score live', hint: 'Toggle skills to "I know this" and watch score increase.' },
    { id: 'persistence', label: 'Changes persist after refresh', hint: 'Toggle a skill, refresh page. Is it still green?' },
    { id: 'history_load', label: 'History saves and loads correctly', hint: 'Go to History page. Is your latest scan there?' },
    { id: 'export_copy', label: 'Export buttons copy the correct content', hint: 'Click Copy on Plan/Questions. Paste to Notepad to verify.' },
    { id: 'no_console_errors', label: 'No console errors on core pages', hint: 'F12 > Console. Should be clean (ignore minor extensions warnings).' }
];

const TestPage = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setCheckedItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse checklist", e);
            }
        }
    }, []);

    useEffect(() => {
        const count = Object.values(checkedItems).filter(Boolean).length;
        setProgress((count / TEST_ITEMS.length) * 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
    }, [checkedItems]);

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the checklist?")) {
            setCheckedItems({});
            toast.info("Checklist reset.");
        }
    };

    const isComplete = progress === 100;

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4 space-y-8">
            <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ClipboardCheck className="h-6 w-6 text-primary" />
                            Pre-Shipment Checklist
                        </CardTitle>
                        <span className={`text-lg font-bold ${isComplete ? 'text-green-600' : 'text-orange-500'}`}>
                            {Object.values(checkedItems).filter(Boolean).length} / {TEST_ITEMS.length} Passed
                        </span>
                    </div>
                    <CardDescription>
                        Manually verify each feature before enabling the ship route.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Progress value={progress} className="h-3" />

                    {!isComplete && (
                        <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 rounded-md text-orange-800 dark:text-orange-200 text-sm flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Shipping is locked. Fix and verify all issues to proceed.
                        </div>
                    )}

                    <div className="space-y-4">
                        {TEST_ITEMS.map((item) => (
                            <div key={item.id} className="flex items-start space-x-3 border-b border-border/50 pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors">
                                <Checkbox
                                    id={item.id}
                                    checked={checkedItems[item.id] || false}
                                    onCheckedChange={() => handleToggle(item.id)}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={item.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {item.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Hint: {item.hint}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset Checklist
                    </Button>
                    <Button
                        onClick={() => navigate('/prp/08-ship')}
                        disabled={!isComplete}
                        className={isComplete ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isComplete ? (
                            <>
                                <Unlock className="mr-2 h-4 w-4" /> Ready to Ship
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" /> Locked
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TestPage;
