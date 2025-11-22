import { useState, useCallback } from 'react';
import { GameState } from '../types/game';

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);

    const startGame = useCallback(() => {
        setGameState('playing');
        setScore(0);
    }, []);

    const endGame = useCallback(() => {
        setGameState('ended');
    }, []);

    const resetGame = useCallback(() => {
        setGameState('idle');
        setScore(0);
    }, []);

    const incrementScore = useCallback((points: number = 1) => {
        setScore((prev) => prev + points);
    }, []);

    return {
        gameState,
        score,
        startGame,
        endGame,
        resetGame,
        incrementScore,
    };
};
