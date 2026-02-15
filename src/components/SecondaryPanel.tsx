import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Rocket, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { toast } from "sonner";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  prompt: string;
}

const SecondaryPanel = ({ stepTitle, stepDescription, prompt }: SecondaryPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="border-l border-border p-3 flex flex-col gap-3 overflow-y-auto">
      <div>
        <h2 className="font-serif text-heading-sm font-semibold text-foreground">{stepTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">{stepDescription}</p>
      </div>

      <div className="border border-border rounded-md p-2 bg-muted/50">
        <p className="text-xs text-muted-foreground mb-1 font-medium">Prompt</p>
        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{prompt}</pre>
      </div>

      <div className="flex flex-col gap-1">
        <Button variant="default" size="sm" onClick={handleCopy} className="justify-start gap-1">
          <Copy className="h-[14px] w-[14px]" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" className="justify-start gap-1">
          <Rocket className="h-[14px] w-[14px]" />
          Build in Lovable
        </Button>
        <Button variant="ghost" size="sm" className="justify-start gap-1 text-success">
          <CheckCircle className="h-[14px] w-[14px]" />
          It Worked
        </Button>
        <Button variant="ghost" size="sm" className="justify-start gap-1 text-destructive">
          <AlertCircle className="h-[14px] w-[14px]" />
          Error
        </Button>
        <Button variant="ghost" size="sm" className="justify-start gap-1">
          <Camera className="h-[14px] w-[14px]" />
          Add Screenshot
        </Button>
      </div>
    </aside>
  );
};

export default SecondaryPanel;
