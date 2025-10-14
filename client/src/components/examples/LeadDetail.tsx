import LeadDetail from "@/pages/LeadDetail";
import { ThemeProvider } from "../ThemeProvider";

export default function LeadDetailExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <LeadDetail />
      </div>
    </ThemeProvider>
  );
}
