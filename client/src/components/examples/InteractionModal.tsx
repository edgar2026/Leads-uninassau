import { useState } from "react";
import { InteractionModal } from "../InteractionModal";
import { Button } from "@/components/ui/button";

export default function InteractionModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Interaction Modal</h2>
      <Button onClick={() => setOpen(true)}>Open Interaction Modal</Button>
      <InteractionModal
        open={open}
        onClose={() => setOpen(false)}
        leadName="Maria Santos"
        onSave={(interaction) => console.log("Saved:", interaction)}
      />
    </div>
  );
}
