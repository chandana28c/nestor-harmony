
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Rocket, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'prp_test_checklist';
const TOTAL_ITEMS = 10; // Must match TestPage

const ShipPage = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const checkedItems = JSON.parse(stored);
                const count = Object.values(checkedItems).filter(Boolean).length;
                if (count === TOTAL_ITEMS) {
                    setIsLocked(false);
                }
            } catch (e) {
                console.error("Failed to parse checklist", e);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="container mx-auto max-w-md py-20 px-4">
                <Card className="border-destructive/50 bg-destructive/5 shadow-xl text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                            <Lock className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                        <CardDescription>
                            You have not completed the pre-flight checklist.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Shipping is locked to prevent critical bugs. Please go back and verify all test cases.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={() => navigate('/prp/07-test')} variant="default">
                            Go to Checklist
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-20 px-4">
            <Card className="border-green-500/20 bg-green-500/5 shadow-2xl text-center animate-in zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-6 rounded-full w-fit mb-6">
                        <Rocket className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
                        Ready for Takeoff!
                    </CardTitle>
                    <CardDescription className="text-lg">
                        All systems go. The Placement Readiness Platform is hardened and verified.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="h-5 w-5" />
                        10/10 Tests Passed
                    </div>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You can now confidentally deploy this build to production.
                        Great work ensuring quality!
                    </p>
                </CardContent>
                <CardFooter className="justify-center pt-8">
                    <Button
                        size="lg"
                        onClick={() => window.open('https://github.com/chandan/nestor-harmony', '_blank')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Go to Repository
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ShipPage;
