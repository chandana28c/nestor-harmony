import { Badge } from "@/components/ui/badge";

type StatusType = "not-started" | "in-progress" | "shipped";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; variant: "muted" | "warning" | "success" }> = {
  "not-started": { label: "Not Started", variant: "muted" },
  "in-progress": { label: "In Progress", variant: "warning" },
  "shipped": { label: "Shipped", variant: "success" },
};

const TopBar = ({ projectName, currentStep, totalSteps, status }: TopBarProps) => {
  const { label, variant } = statusConfig[status];

  return (
    <header className="flex items-center justify-between border-b border-border px-3 h-[48px] shrink-0">
      <span className="font-serif text-sm font-semibold text-foreground">{projectName}</span>
      <span className="text-xs text-muted-foreground">
        Step {currentStep} / {totalSteps}
      </span>
      <Badge variant={variant}>{label}</Badge>
    </header>
  );
};

export default TopBar;
