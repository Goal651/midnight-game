import { useState, useCallback } from 'react';

export interface Target {
    id: string;
    x: number;      // World X position (meters)
    y: number;      // World Y position (meters)
    z: number;      // World Z position (meters)
    color: string;
    size: number;
}

const MAX_TARGETS = 10;

export const useTargets = (isPlaying: boolean) => {
    const [targets, setTargets] = useState<Target[]>([]);

    const spawnTarget = useCallback(() => {
        if (targets.length >= MAX_TARGETS) return;

        const id = Math.random().toString(36).substr(2, 9);

        // Spawn targets in a sphere around the player
        // Radius: 3-5 meters
        const radius = 3 + Math.random() * 2;

        // Random angle in 360 degrees
        const angle = Math.random() * Math.PI * 2;

        // Height variation: -1m to +1m from eye level
        const height = (Math.random() * 2) - 1;

        // Convert spherical to Cartesian coordinates
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = height;

        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#F7FFF7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 0.3 + Math.random() * 0.2; // 0.3-0.5 meters in world

        const newTarget: Target = { id, x, y, z, color, size };

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
