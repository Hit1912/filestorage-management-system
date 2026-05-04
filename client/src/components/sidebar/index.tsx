import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { NavLink, useLocation } from "react-router-dom";
import { Folder, HelpCircle, Home, Key, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const { pathname } = useLocation();

  const routes = [
    {
      icon: Home,
      href: PROTECTED_ROUTES.OVERVIEW,
      label: "Overview",
    },
    {
      icon: Folder,
      href: PROTECTED_ROUTES.FILES,
      label: "Files",
    },
    {
      icon: HelpCircle,
      href: PROTECTED_ROUTES.DOCS,
      label: "Docs",
    },
    {
      icon: Key,
      href: PROTECTED_ROUTES.APIKEYS,
      label: "Api Keys",
    },
    {
      icon: Settings,
      href: PROTECTED_ROUTES.SETTINGS,
      label: "Settings",
    },
  ];

  return (
    <div className="hidden lg:flex w-screen sticky shrink-0 top-24 flex-col sm:w-[240px] h-[calc(100vh-120px)] pr-4">
      <nav className="flex-1">
        <ul className="flex flex-col gap-y-2 py-4">
          {routes.map((route, i) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <li key={i}>
                <NavLink
                  className={cn(
                    "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                    "hover:bg-primary/5 hover:text-primary",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                      : "text-muted-foreground hover:translate-x-1"
                  )}
                  to={route.href}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  )}
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground/70"
                    )}
                  />
                  <span className="truncate">{route.label}</span>
                  {isActive && (
                    <Sparkles className="ml-auto size-3 opacity-50 animate-pulse" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Optional: Sidebar Footer/Banner */}
      <div className="mt-auto p-4 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
          Pro Plan
        </p>
        <p className="text-xs text-muted-foreground leading-tight">
          Unlock all features and priority support.
        </p>
      </div>
    </div>
  );
};

export default SideBar;

