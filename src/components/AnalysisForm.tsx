import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJD, saveAnalysis } from '@/lib/analysisUtils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';

const AnalysisForm = () => {
    const navigate = useNavigate();
    const [jdText, setJdText] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!jdText.trim()) return;

        setIsAnalyzing(true);

        // Simulating a small delay for UX "thinking" feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = analyzeJD(jdText, company, role);
        saveAnalysis(result);

        setIsAnalyzing(false);
        navigate(`/dashboard/results?id=${result.id}`);
    };

    return (
        <Card className="w-full shadow-md border-primary/20 bg-background/60 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    New Analysis
                </CardTitle>
                <CardDescription>
                    Paste a Job Description to get a tailored preparation plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                            id="company"
                            placeholder="e.g. Google"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role (Optional)</Label>
                        <Input
                            id="role"
                            placeholder="e.g. Frontend Engineer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jd">Job Description</Label>
                    <Textarea
                        id="jd"
                        placeholder="Paste the full JD here..."
                        className="min-h-[150px]"
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleAnalyze}
                    disabled={!jdText.trim() || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Skills...
                        </>
                    ) : (
                        <>
                            Analyze Readiness
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AnalysisForm;
