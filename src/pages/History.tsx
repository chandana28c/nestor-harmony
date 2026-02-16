import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, AnalysisResult } from '@/lib/analysisUtils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History as HistoryIcon, ArrowRight, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleSelect = (id: string) => {
        navigate(`/dashboard/results?id=${id}`);
    };

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem('placement_history');
            setHistory([]);
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">History</h1>
                    <p className="text-muted-foreground">Review your past readiness analyses.</p>
                </div>
                {history.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear History
                    </Button>
                )}
            </div>

            {history.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <HistoryIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium">No history found</h3>
                        <p className="text-muted-foreground mb-4">You haven't analyzed any job descriptions yet.</p>
                        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-primary"
                            onClick={() => handleSelect(item.id)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{item.role}</CardTitle>
                                        <CardDescription>{item.company}</CardDescription>
                                    </div>
                                    <Badge variant={item.readinessScore >= 80 ? "default" : "secondary"}>
                                        {item.readinessScore}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
