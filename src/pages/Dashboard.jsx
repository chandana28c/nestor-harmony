import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import OverallReadiness from '@/components/dashboard/OverallReadiness';
import SkillRadar from '@/components/dashboard/SkillRadar';
import ContinuePractice from '@/components/dashboard/ContinuePractice';
import WeeklyGoals from '@/components/dashboard/WeeklyGoals';
import UpcomingAssessments from '@/components/dashboard/UpcomingAssessments';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-3">
                    <OverallReadiness />
                </div>
                <div className="col-span-4 lg:col-span-4">
                    <SkillRadar />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-1">
                    <ContinuePractice />
                </div>
                <div className="col-span-1">
                    <WeeklyGoals />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <UpcomingAssessments />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
