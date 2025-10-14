import { useState } from "react";
import { LeadFormModal } from "../LeadFormModal";
import { Button } from "@/components/ui/button";

export default function LeadFormModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Lead Form Modal</h2>
      <Button onClick={() => setOpen(true)}>Open Lead Form</Button>
      <LeadFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(lead) => console.log("Saved:", lead)}
      />
    </div>
  );
}
