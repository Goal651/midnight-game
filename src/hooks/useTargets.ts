import { useState, useCallback, useRef } from 'react';
import { Target } from '../types/game';

const MAX_TARGETS = 5;

export const useTargets = (isPlaying: boolean) => {
    const [targets, setTargets] = useState<Target[]>([]);
    const nextId = useRef(0);

    const generateRandomPosition = () => {
        // Keep targets somewhat central (10-90%)
        return {
            x: Math.floor(Math.random() * 80) + 10,
            y: Math.floor(Math.random() * 80) + 10,
        };
    };

    const generateRandomColor = () => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const spawnTarget = useCallback(() => {
        if (targets.length >= MAX_TARGETS) return;

        const { x, y } = generateRandomPosition();
        const newTarget: Target = {
            id: `target-${nextId.current++}`,
            x,
            y,
            color: generateRandomColor(),
            isVisible: true,
        };

        setTargets((prev) => [...prev, newTarget]);
    }, [targets.length]);

    const removeTarget = useCallback((id: string) => {
        setTargets((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const resetTargets = useCallback(() => {
        setTargets([]);
        nextId.current = 0;
    }, []);

    // Initial spawn and periodic spawning
    // Note: In a real game loop we might want more control, but this works for now
    // We'll handle the spawning interval in the main component or a separate effect here if needed
    // For now, let's expose a spawn function and let the consumer decide when to spawn

    return {
        targets,
        spawnTarget,
        removeTarget,
        resetTargets,
    };
};
