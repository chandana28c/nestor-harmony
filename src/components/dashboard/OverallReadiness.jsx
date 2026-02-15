import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OverallReadiness = () => {
    const score = 72;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card className="flex flex-col items-center justify-center p-6 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent className="relative flex items-center justify-center p-6">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#4f46e5" // Indigo-600
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{score}/100</span>
                        <span className="text-sm text-gray-500 mt-1">Readiness Score</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OverallReadiness;
