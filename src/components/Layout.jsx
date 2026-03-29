import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutGrid, Upload, Home, Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

const baseNavItems = [
  { path: "/", label: "Gallery", icon: LayoutGrid },
];

export default function Layout() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = currentUser?.role === "admin"
    ? [...baseNavItems, { path: "/upload", label: "Upload", icon: Upload }, { path: "/admin", label: "Admin", icon: ShieldCheck }]
    : baseNavItems;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-20 border-r border-border bg-sidebar fixed inset-y-0 left-0 z-40">
        <div className="flex items-center justify-center h-20 border-b border-sidebar-border">
          <Home className="w-5 h-5 text-sidebar-primary" />
        </div>
        <nav className="flex-1 flex flex-col items-center gap-2 pt-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all duration-200 group w-16 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="w-3 h-3 rounded-full bg-sidebar-primary mx-auto" />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-sidebar border-b border-sidebar-border z-50 flex items-center justify-between px-4">
        <Home className="w-5 h-5 text-sidebar-primary" />
        <span className="font-heading font-semibold text-sidebar-foreground tracking-tight">HARP'S OUTLET</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-sidebar-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sidebar/95 backdrop-blur-sm pt-16" onClick={() => setMobileOpen(false)}>
          <nav className="flex flex-col items-center gap-4 pt-12">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-heading tracking-tight ${
                    isActive ? "text-sidebar-primary bg-sidebar-accent" : "text-sidebar-foreground/60"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-20 mt-16 lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
}