import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { CameraView } from '../src/components/CameraView';
import { Target } from '../src/components/Target';
import { GameHUD } from '../src/components/GameHUD';
import { Crosshair } from '../src/components/Crosshair';
import { Weapon } from '../src/components/Weapon';
import { useGameState } from '../src/hooks/useGameState';
import { useTimer } from '../src/hooks/useTimer';
import { useTargets } from '../src/hooks/useTargets';
import { useOrientation } from '../src/hooks/useOrientation';

const FOV = 60;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
    const router = useRouter();
    const { score, incrementScore, gameState, startGame, endGame } = useGameState();
    const { targets, spawnTarget, removeTarget } = useTargets(gameState === 'playing');
    const { orientation } = useOrientation();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isShooting, setIsShooting] = useState(false);

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
                require('../../assets/sounds/hit.mp3')
            );
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    // Play shoot sound (different from hit)
    const playShootSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/shoot.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing shoot sound:', error);
        }
    };

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const triggerShoot = () => {
        setIsShooting(true);
        playShootSound();
        // Reset shooting state after animation
        setTimeout(() => setIsShooting(false), 100);
    };

    const handleTargetHit = (id: string) => {
        triggerShoot();
        playHitSound();
        incrementScore();
        removeTarget(id);
    };

    const handleMiss = () => {
        triggerShoot();
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

    // Project target to screen coordinates
    const getTargetScreenPosition = (targetYaw: number, targetPitch: number) => {
        let deltaYaw = targetYaw - orientation.yaw;

        // Handle wrapping
        if (deltaYaw > 180) deltaYaw -= 360;
        if (deltaYaw < -180) deltaYaw += 360;

        const deltaPitch = targetPitch - orientation.pitch;

        const x = (deltaYaw / (FOV / 2)) * (SCREEN_WIDTH / 2) + SCREEN_WIDTH / 2;
        const y = (deltaPitch / (FOV / 2)) * (SCREEN_HEIGHT / 2) + SCREEN_HEIGHT / 2;

        return { x, y };
    };

    return (
        <View className="flex-1">
            <CameraView>
                {/* Full screen pressable for misses */}
                <Pressable className="absolute inset-0" onPress={handleMiss} />

                {targets.map((target) => {
                    const { x, y } = getTargetScreenPosition(target.yaw, target.pitch);
                    return (
                        <Target
                            key={target.id}
                            {...target}
                            x={x}
                            y={y}
                            onHit={handleTargetHit}
                        />
                    );
                })}

                <GameHUD score={score} timeRemaining={timeRemaining} />
                <Crosshair />
                <Weapon isShooting={isShooting} />
            </CameraView>
        </View>
    );
}
