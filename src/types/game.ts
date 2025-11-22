export interface Target {
    id: string;
    x: number; // position as percentage of screen width (0-100)
    y: number; // position as percentage of screen height (0-100)
    color: string;
    isVisible: boolean;
}

export type GameState = 'idle' | 'playing' | 'ended';

export interface GameStats {
    score: number;
    timeRemaining: number;
}
