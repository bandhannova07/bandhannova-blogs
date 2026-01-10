"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-6 w-6 md:h-7 md:w-7" />
            ) : (
                <Moon className="h-6 w-6 md:h-7 md:w-7" />
            )}
        </button>
    );
}
