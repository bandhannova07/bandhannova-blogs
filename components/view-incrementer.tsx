
"use client";

import { useEffect, useRef } from "react";

interface ViewIncrementerProps {
    blogId: string;
}

export function ViewIncrementer({ blogId }: ViewIncrementerProps) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        // Prevent double execution in Strict Mode or re-renders
        if (hasIncremented.current) return;
        
        const incrementView = async () => {
            try {
                await fetch(`/api/blogs/${blogId}/views`, {
                    method: "POST",
                });
                hasIncremented.current = true;
            } catch (error) {
                console.error("Failed to increment view count:", error);
            }
        };

        incrementView();
    }, [blogId]);

    return null;
}
