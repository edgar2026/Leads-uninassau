import Dashboard from "@/pages/Dashboard";
import { ThemeProvider } from "../ThemeProvider";

export default function DashboardExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}
