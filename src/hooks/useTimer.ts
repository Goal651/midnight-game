import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialTime: number, onTimeEnd: () => void) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback(() => {
        setIsRunning(true);
    }, []);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setTimeRemaining(initialTime);
    }, [initialTime, stopTimer]);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        stopTimer();
                        onTimeEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, timeRemaining, onTimeEnd, stopTimer]);

    return { timeRemaining, startTimer, stopTimer, resetTimer, isRunning };
};
