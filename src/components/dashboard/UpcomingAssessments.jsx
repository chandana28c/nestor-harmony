import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const assessments = [
    { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", type: "Technical" },
    { title: "System Design Review", time: "Wed, 2:00 PM", type: "Technical" },
    { title: "HR Interview Prep", time: "Friday, 11:00 AM", type: "Behavioral" },
];

const UpcomingAssessments = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Assessments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assessments.map((item, index) => (
                        <div key={index} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                                <div className="flex items-center text-xs text-gray-500 gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default UpcomingAssessments;
