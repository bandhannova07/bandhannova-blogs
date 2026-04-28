"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        // Use resolvedTheme to determine the current actual theme
        // resolvedTheme gives us the actual applied theme (light/dark)
        const currentActualTheme = resolvedTheme || theme || "system";
        
        if (currentActualTheme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    if (!mounted) {
        return null;
    }

    // Use resolvedTheme for icon display (shows actual applied theme)
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-primary/10 w-12 h-12 md:w-14 md:h-14 transition-all duration-300"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-6 w-6 md:h-7 md:w-7 text-primary transition-all duration-300" />
            ) : (
                <Moon className="h-6 w-6 md:h-7 md:w-7 text-primary transition-all duration-300" />
            )}
        </Button>
    );
}
