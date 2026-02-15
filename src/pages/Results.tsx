import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysis, AnalysisResult } from '@/lib/analysisUtils';
import ResultsView from '@/components/ResultsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Results = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (id) {
            const data = getAnalysis(id);
            if (data) {
                setResult(data);
            } else {
                // Handle invalid ID
                navigate('/dashboard');
            }
        } else {
            navigate('/dashboard');
        }
    }, [id, navigate]);

    if (!result) return null; // Or a loading spinner

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <ResultsView result={result} />
        </div>
    );
};

export default Results;
