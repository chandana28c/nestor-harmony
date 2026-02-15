import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { title: "Practice", to: "/dashboard/practice", icon: BookOpen },
  { title: "Assessments", to: "/dashboard/assessments", icon: ClipboardCheck },
  { title: "Resources", to: "/dashboard/resources", icon: FolderOpen },
  { title: "Profile", to: "/dashboard/profile", icon: User },
];

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col shrink-0">
        <div className="px-6 py-5 text-lg font-bold tracking-tight">
          Placement Prep
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/70 hover:bg-sidebar-accent hover:text-primary-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-primary-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-foreground">Placement Prep</h2>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              U
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
