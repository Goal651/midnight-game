import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { CameraView } from '../src/components/CameraView';
import { Target } from '../src/components/Target';
import { GameHUD } from '../src/components/GameHUD';
import { Crosshair } from '../src/components/Crosshair';
import { useGameState } from '../src/hooks/useGameState';
import { useTimer } from '../src/hooks/useTimer';
import { useTargets } from '../src/hooks/useTargets';

export default function GameScreen() {
    const router = useRouter();
    const { score, incrementScore, gameState, startGame, endGame } = useGameState();
    const { targets, spawnTarget, removeTarget } = useTargets(gameState === 'playing');
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const handleTimeEnd = useCallback(() => {
        endGame();
    }, [endGame]);

    const { timeRemaining, startTimer, stopTimer } = useTimer(30, handleTimeEnd);

    // Initialize game
    useEffect(() => {
        startGame();
        startTimer();
        return () => stopTimer();
    }, [startGame, startTimer, stopTimer]);

    // Spawn targets loop
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                spawnTarget();
            }, 1500); // Spawn every 1.5 seconds
            return () => clearInterval(interval);
        }
    }, [gameState, spawnTarget]);

    // Play sound
    const playHitSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://www.soundjay.com/button/sounds/beep-07a.mp3' }
            );
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const handleTargetHit = (id: string) => {
        playHitSound();
        incrementScore();
        removeTarget(id);
    };

    const handleGameOver = useCallback(() => {
        router.replace({
            pathname: '/game-over',
            params: { score: score.toString() }
        });
    }, [router, score]);

    // Navigate to game over when game ends
    useEffect(() => {
        if (gameState === 'ended') {
            handleGameOver();
        }
    }, [gameState, handleGameOver]);

    return (
        <View style={styles.container}>
            <CameraView>
                {targets.map((target) => (
                    <Target
                        key={target.id}
                        {...target}
                        onHit={handleTargetHit}
                    />
                ))}

                <GameHUD score={score} timeRemaining={timeRemaining} />
                <Crosshair />
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
