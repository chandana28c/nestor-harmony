
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Copy, Rocket, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
    "Project Setup & Routing",
    "Core Shell & Navigation",
    "Job Description Analysis Engine",
    "Skill Extraction & Scoring",
    "Company Intel & Heuristics",
    "Dynamic Round Mapping",
    "Platform Hardening & Validation",
    "QA Testing Suite"
];

const STORAGE_KEY_CHECKLIST = 'prp_test_checklist';
const STORAGE_KEY_PROOF = 'prp_final_submission';

const ProofPage = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [checklistPassed, setChecklistPassed] = useState(false);
    const [checklistCount, setChecklistCount] = useState(0);

    // Load state
    useEffect(() => {
        // Load Checklist Status
        const checklistStored = localStorage.getItem(STORAGE_KEY_CHECKLIST);
        if (checklistStored) {
            try {
                const items = JSON.parse(checklistStored);
                const count = Object.values(items).filter(Boolean).length;
                setChecklistCount(count);
                if (count === 10) setChecklistPassed(true);
            } catch (e) { console.error(e); }
        }

        // Load Links
        const proofStored = localStorage.getItem(STORAGE_KEY_PROOF);
        if (proofStored) {
            try {
                setLinks(JSON.parse(proofStored));
            } catch (e) { console.error(e); }
        }
    }, []);

    // Save links on change
    const handleLinkChange = (key: string, value: string) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem(STORAGE_KEY_PROOF, JSON.stringify(newLinks));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);
    const isShipped = checklistPassed && allLinksValid;

    const copyFinalSubmission = () => {
        if (!isShipped) {
            toast.error("Finish all requirements before copying.");
            return;
        }

        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();

        navigator.clipboard.writeText(text);
        toast.success("Final Submission copied to clipboard!");
    };

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8 animate-in fade-in duration-500">

            {/* Header / Status */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Proof of Work</h1>
                    <p className="text-muted-foreground">Final verification and submission generation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Project Status:</span>
                    {isShipped ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-base py-1 px-4 shadow-lg shadow-green-500/20">
                            <Rocket className="mr-2 h-4 w-4" /> Shipped
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-base py-1 px-4">
                            In Progress
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Left Col: Requirements */}
                <div className="space-y-6">
                    {/* Steps Overview */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">1. Build Steps (8/8)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {STEPS.map((step, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-muted-foreground line-through decoration-green-500/50">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* QA Status */}
                    <Card className={checklistPassed ? "border-green-500/20 bg-green-500/5" : "border-orange-500/20 bg-orange-500/5"}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex justify-between">
                                2. QA Checklist
                                <span className={checklistPassed ? "text-green-600" : "text-orange-600"}>{checklistCount}/10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={checklistCount * 10} className="h-2 mb-2" />
                            {checklistPassed ? (
                                <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> All tests passed
                                </p>
                            ) : (
                                <p className="text-sm text-orange-700 font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Incomplete. Go to QA Checklist.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Inputs & Final Action */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">3. Deployment Proof</CardTitle>
                            <CardDescription>Required for final shipped status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Lovable Project Link</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://lovable.dev/..."
                                        value={links.lovable}
                                        onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                        className={links.lovable && !isValidUrl(links.lovable) ? "border-red-500" : ""}
                                    />
                                    {isValidUrl(links.lovable) && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>GitHub Repository</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://github.com/..."
                                        value={links.github}
                                        onChange={(e) => handleLinkChange('github', e.target.value)}
                                        className={links.github && !isValidUrl(links.github) ? "border-red-500" : ""}
                                    />
                                    {isValidUrl(links.github) && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Live Deployment URL</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://..."
                                        value={links.deployed}
                                        onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                        className={links.deployed && !isValidUrl(links.deployed) ? "border-red-500" : ""}
                                    />
                                    {isValidUrl(links.deployed) && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isShipped && (
                        <Card className="bg-primary text-primary-foreground border-none shadow-xl animate-in slide-in-from-bottom-5">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                                    <Rocket className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">You built a real product.</h3>
                                    <p className="text-primary-foreground/80 mt-2 text-sm leading-relaxed">
                                        Not a tutorial. Not a clone.<br />
                                        A structured tool that solves a real problem.<br />
                                        This is your proof of work.
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full font-bold"
                                    onClick={copyFinalSubmission}
                                >
                                    <Copy className="mr-2 h-4 w-4" /> Copy Final Submission
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
