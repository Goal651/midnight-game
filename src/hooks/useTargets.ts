import { useState, useCallback } from 'react';

export interface Target {
    id: string;
    yaw: number;   // Horizontal angle in world space (0-360 degrees)
    pitch: number; // Vertical angle in world space (-90 to 90 degrees)
    color: string;
    size: number;
}

const MAX_TARGETS = 10;

export const useTargets = (isPlaying: boolean) => {
    const [targets, setTargets] = useState<Target[]>([]);

    const spawnTarget = useCallback(() => {
        if (targets.length >= MAX_TARGETS) return;

        const id = Math.random().toString(36).substr(2, 9);

        // Spawn targets in a 360-degree circle around the user
        const yaw = Math.random() * 360;

        // Spawn at eye level with some variation (-20 to +20 degrees)
        const pitch = (Math.random() * 40) - 20;

        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#F7FFF7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 60 + Math.random() * 40;

        const newTarget: Target = { id, yaw, pitch, color, size };

        setTargets(prev => [...prev, newTarget]);
    }, [targets]);

    const removeTarget = useCallback((id: string) => {
        setTargets(prev => prev.filter(t => t.id !== id));
    }, []);

    const resetTargets = useCallback(() => {
        setTargets([]);
    }, []);

    return {
        targets,
        spawnTarget,
        removeTarget,
        resetTargets
    };
};
