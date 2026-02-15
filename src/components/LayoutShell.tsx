import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import ContextHeader from "@/components/ContextHeader";
import ProofFooter from "@/components/ProofFooter";
import SecondaryPanel from "@/components/SecondaryPanel";

interface LayoutShellProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: "not-started" | "in-progress" | "shipped";
  headline: string;
  subtext: string;
  stepTitle: string;
  stepDescription: string;
  prompt: string;
  children: ReactNode;
}

const LayoutShell = ({
  projectName,
  currentStep,
  totalSteps,
  status,
  headline,
  subtext,
  stepTitle,
  stepDescription,
  prompt,
  children,
}: LayoutShellProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar
        projectName={projectName}
        currentStep={currentStep}
        totalSteps={totalSteps}
        status={status}
      />
      <ContextHeader headline={headline} subtext={subtext} />

      <div className="flex flex-1 min-h-0">
        <main className="flex-[7] overflow-y-auto p-3">
          {children}
        </main>
        <div className="flex-[3] min-w-[280px]">
          <SecondaryPanel
            stepTitle={stepTitle}
            stepDescription={stepDescription}
            prompt={prompt}
          />
        </div>
      </div>

      <ProofFooter />
    </div>
  );
};

export default LayoutShell;
