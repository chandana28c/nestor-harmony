import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const WeeklyGoals = () => {
    const solved = 12;
    const goal = 20;
    const progress = (solved / goal) * 100;
    const days = [
        { name: 'M', active: true },
        { name: 'T', active: true },
        { name: 'W', active: false },
        { name: 'T', active: true },
        { name: 'F', active: true },
        { name: 'S', active: false },
        { name: 'S', active: false },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Problems Solved</span>
                        <span className="text-sm text-gray-500">{solved}/{goal}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center pt-2">
                    {days.map((day, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium 
                  ${day.active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {day.name}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyGoals;
