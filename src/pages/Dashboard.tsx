import AnalysisForm from '@/components/AnalysisForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, Target, Zap } from 'lucide-react';

const Dashboard = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back. Ready to crack your dream job?</p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2/5</div>
          <p className="text-xs text-muted-foreground">Problems solved today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3 Days</div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
          <Rocket className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Analyze a JD to see score</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <AnalysisForm />
      </div>
      <div className="col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No recent activity. Start by analyzing a job description!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default Dashboard;
