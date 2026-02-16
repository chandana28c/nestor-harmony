import { useNavigate } from "react-router-dom";
import { Code, Video, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Code,
    title: "Practice Problems",
    description: "Solve curated coding challenges across data structures, algorithms, and more.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with timed sessions and feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Visualize your growth with detailed analytics and performance insights.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Ace Your Placement
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Practice, assess, and prepare for your dream job.
        </p>
        <Button size="lg" className="mt-8 text-base px-8" onClick={() => navigate("/dashboard")}>
          Get Started
        </Button>
      </section>

      {/* Features */}
      <section className="bg-secondary py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Placement Prep. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
