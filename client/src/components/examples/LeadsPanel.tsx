import LeadsPanel from "@/pages/LeadsPanel";
import { ThemeProvider } from "../ThemeProvider";

export default function LeadsPanelExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <LeadsPanel />
      </div>
    </ThemeProvider>
  );
}
