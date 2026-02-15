import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const footerItems = [
  { id: "ui", label: "UI Built" },
  { id: "logic", label: "Logic Working" },
  { id: "test", label: "Test Passed" },
  { id: "deployed", label: "Deployed" },
];

const ProofFooter = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <footer className="flex items-center gap-3 border-t border-border px-3 h-[48px] shrink-0">
      {footerItems.map((item) => (
        <label key={item.id} className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer select-none">
          <Checkbox
            checked={!!checked[item.id]}
            onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [item.id]: !!val }))}
          />
          {item.label}
        </label>
      ))}
    </footer>
  );
};

export default ProofFooter;
