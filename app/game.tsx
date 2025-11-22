import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-audio';
import { CameraView } from '../src/components/CameraView';
import { Target } from '../src/components/Target';
import { GameHUD } from '../src/components/GameHUD';
import { Crosshair } from '../src/components/Crosshair';
import { Weapon } from '../src/components/Weapon';
import { useGameState } from '../src/hooks/useGameState';
import { useTimer } from '../src/hooks/useTimer';
import { useTargets } from '../src/hooks/useTargets';
import { useOrientation } from '../src/hooks/useOrientation';

const FOV = 70; // Field of view in degrees
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
    const router = useRouter();
    const { score, incrementScore, gameState, startGame, endGame } = useGameState();
    const { targets, spawnTarget, removeTarget } = useTargets(gameState === 'playing');
    const { orientation } = useOrientation();
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
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [gameState, spawnTarget]);

    // Play sound
    const playHitSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/hit.mp3')
            );
            await sound.playAsync();
            // Auto-unload after playing
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Error playing hit sound:', error);
        }
    };

    const playShootSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/shoot.mp3')
            );
            await sound.playAsync();
            // Auto-unload after playing
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log('Error playing shoot sound:', error);
        }
    };

    const triggerShoot = () => {
        setIsShooting(true);
        playShootSound();
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

    useEffect(() => {
        if (gameState === 'ended') {
            handleGameOver();
        }
    }, [gameState, handleGameOver]);

    // Project world coordinates to screen coordinates
    const projectToScreen = (targetYaw: number, targetPitch: number) => {
        // Calculate angular difference between camera and target
        let deltaYaw = targetYaw - orientation.yaw;

        // Normalize to -180 to 180
        while (deltaYaw > 180) deltaYaw -= 360;
        while (deltaYaw < -180) deltaYaw += 360;

        const deltaPitch = targetPitch - orientation.pitch;

        // Check if target is within field of view
        const halfFOV = FOV / 2;
        const isVisible = Math.abs(deltaYaw) < halfFOV && Math.abs(deltaPitch) < halfFOV;

        // Map angular difference to screen position
        // Center of screen = 0 degrees offset
        const x = (deltaYaw / halfFOV) * (SCREEN_WIDTH / 2) + (SCREEN_WIDTH / 2);
        const y = (-deltaPitch / halfFOV) * (SCREEN_HEIGHT / 2) + (SCREEN_HEIGHT / 2);

        return { x, y, isVisible };
    };

    return (
        <View className="flex-1">
            <CameraView>
                <Pressable className="absolute inset-0" onPress={handleMiss} />

                {targets.map((target) => {
                    const { x, y, isVisible } = projectToScreen(target.yaw, target.pitch);

                    if (!isVisible) return null;

                    return (
                        <Target
                            key={target.id}
                            id={target.id}
                            x={x}
                            y={y}
                            size={target.size}
                            color={target.color}
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
