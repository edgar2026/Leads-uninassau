import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, GraduationCap, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["Administrador", "Diretor", "Coordenador", "QG", "Comercial"],
  },
  {
    title: "Meus Leads",
    url: "/leads",
    icon: Users,
    roles: ["Administrador", "Diretor", "Coordenador", "QG", "Comercial"],
  },
  {
    title: "Cursos",
    url: "/cursos",
    icon: GraduationCap,
    roles: ["Administrador", "Diretor", "Coordenador", "QG", "Comercial"],
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    roles: ["Administrador"],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { profile, signOut } = useAuth();

  const accessibleMenuItems = menuItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sm">CRM Educacional</h2>
            <p className="text-xs text-muted-foreground">Gestão de Leads</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button data-testid="button-logout" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {profile && (
          <div className="mt-3 px-2">
            <p className="text-xs font-medium truncate">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}