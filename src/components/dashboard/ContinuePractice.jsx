import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ContinuePractice = () => {
    const topic = "Dynamic Programming";
    const completed = 3;
    const total = 10;
    const progress = (completed / total) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Continue Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">{topic}</h3>
                    <p className="text-sm text-gray-500">{completed}/{total} completed</p>
                </div>
                <Progress value={progress} className="h-2" />
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Continue
                </Button>
            </CardContent>
        </Card>
    );
};

export default ContinuePractice;
