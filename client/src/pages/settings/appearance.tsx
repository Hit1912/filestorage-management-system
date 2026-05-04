"use client";

import { Monitor, Moon, Sun, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const Appearance = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
      description: "Clean and bright look",
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      id: "system",
      label: "System",
      icon: Monitor,
      description: "Syncs with your OS",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Appearance</h3>
        <p className="text-base text-muted-foreground mt-1">
          Customize how the platform looks and feels to you.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
            Interface Theme
          </Label>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <div key={t.id} className="relative">
                  <RadioGroupItem
                    value={t.id}
                    id={t.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={t.id}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer relative overflow-hidden",
                      "hover:bg-accent/50 hover:border-primary/30",
                      isActive
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/40 bg-card/50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "mb-4 p-3 rounded-xl transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground group-hover:text-primary"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">
                      {t.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 text-center">
                      {t.description}
                    </span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default Appearance;

