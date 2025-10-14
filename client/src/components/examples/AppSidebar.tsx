import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "../ThemeProvider";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <ThemeProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold">Sidebar Navigation</h2>
            <p className="text-muted-foreground mt-2">
              Use the sidebar to navigate between different sections
            </p>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
