import LayoutShell from "@/components/LayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Info } from "lucide-react";

const Index = () => {
  return (
    <LayoutShell
      projectName="KodNest Premium"
      currentStep={1}
      totalSteps={8}
      status="in-progress"
      headline="Design System"
      subtext="All components, tokens, and patterns — confirmed in one view."
      stepTitle="Step 1: Foundation"
      stepDescription="Review every component below. Confirm the design system feels calm, intentional, and visually coherent."
      prompt="Create a premium SaaS design system with off-white background, deep red accent, serif headings, and clean sans-serif body text."
    >
      <div className="flex flex-col gap-4">
        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Serif headings paired with clean sans-serif body.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <h1 className="font-serif text-heading-xl font-bold">Heading XL — 48px</h1>
            <h2 className="font-serif text-heading-lg font-bold">Heading LG — 36px</h2>
            <h3 className="font-serif text-heading-md font-semibold">Heading MD — 28px</h3>
            <h4 className="font-serif text-heading-sm font-semibold">Heading SM — 20px</h4>
            <p className="text-body text-prose">
              Body text at 16px with 1.7 line-height. Clean, readable, and constrained to 720px max-width. Every block of text must feel spacious and intentional, never cramped.
            </p>
            <p className="text-body-lg text-prose">
              Body large at 18px for emphasis blocks. Same line-height, same calm rhythm.
            </p>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Primary, secondary, and utility variants.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="default" size="sm">Small</Button>
            <Button variant="default" size="lg">Large</Button>
            <Button variant="default" disabled>Disabled</Button>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Clean borders, clear focus state.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 max-w-[360px]">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled input" disabled />
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators for the system.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </CardContent>
        </Card>

        {/* Checkboxes */}
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes</CardTitle>
            <CardDescription>For proof footer and forms.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm cursor-pointer">
              <Checkbox /> Unchecked item
            </label>
            <label className="flex items-center gap-1 text-sm cursor-pointer">
              <Checkbox defaultChecked /> Checked item
            </label>
          </CardContent>
        </Card>

        {/* Error & Empty States */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-destructive/30">
            <CardContent className="flex items-start gap-2 pt-3">
              <AlertCircle className="h-[16px] w-[16px] text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Build failed</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The component couldn't compile. Check your prompt for syntax issues and try again.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-2 pt-3">
              <Info className="h-[16px] w-[16px] text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">No steps yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Start by adding your first build step to begin the process.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>The full token set in use.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Background", className: "bg-background border" },
                { name: "Foreground", className: "bg-foreground" },
                { name: "Primary", className: "bg-primary" },
                { name: "Muted", className: "bg-muted border" },
                { name: "Border", className: "bg-border" },
                { name: "Success", className: "bg-success" },
                { name: "Warning", className: "bg-warning" },
                { name: "Destructive", className: "bg-destructive" },
              ].map(({ name, className }) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div className={`w-[48px] h-[48px] rounded-md ${className}`} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
};

export default Index;
