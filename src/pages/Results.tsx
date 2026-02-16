import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysis, getHistory, updateAnalysis, AnalysisResult } from '@/lib/analysisUtils';
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
                navigate('/dashboard');
            }
        } else {
            const history = getHistory();
            const latest = history[0];
            if (latest) setResult(latest);
            else navigate('/dashboard');
        }
    }, [id, navigate]);

    const handleResultChange = useCallback((updated: AnalysisResult) => {
        setResult(updated);
        updateAnalysis(updated);
    }, []);

    if (!result) return null;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <ResultsView result={result} onResultChange={handleResultChange} />
        </div>
    );
};

export default Results;
