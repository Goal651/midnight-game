import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Audio as ExpoAudio } from 'expo-av';
import { CameraView } from '@/src/components/CameraView';
import { Target } from '@/src/components/Target';
import { GameHUD } from '@/src/components/GameHUD';
import { Crosshair } from '@/src/components/Crosshair';
import { Weapon } from '@/src/components/Weapon';
import { useGameState } from '@/src/hooks/useGameState';
import { useTimer } from '@/src/hooks/useTimer';
import { useTargets } from '@/src/hooks/useTargets';
import { useOrientation } from '@/src/hooks/useOrientation';

const FOV = 70; // Field of view in degrees
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
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
            const { sound } = await ExpoAudio.Sound.createAsync(
                require('@/assets/sounds/hit.mp3')
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
            const { sound } = await ExpoAudio.Sound.createAsync(
                require('@/assets/sounds/shoot.mp3')
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

    // Project 3D world position to 2D screen position
    const projectToScreen = (targetX: number, targetY: number, targetZ: number, targetSize: number) => {
        // Calculate relative position (target position - camera position)
        const relX = targetX - orientation.x;
        const relY = targetY - orientation.y;
        const relZ = targetZ - orientation.z;

        // Rotate relative position based on camera orientation
        const yawRad = (orientation.yaw * Math.PI) / 180;
        const pitchRad = (orientation.pitch * Math.PI) / 180;

        // Apply rotation around Y axis (yaw)
        const rotatedX = relX * Math.cos(yawRad) + relZ * Math.sin(yawRad);
        const rotatedZ = -relX * Math.sin(yawRad) + relZ * Math.cos(yawRad);

        // Apply rotation around X axis (pitch)
        const rotatedY = relY * Math.cos(pitchRad) - rotatedZ * Math.sin(pitchRad);
        const finalZ = relY * Math.sin(pitchRad) + rotatedZ * Math.cos(pitchRad);

        // Check if target is behind camera
        if (finalZ <= 0.1) {
            return { x: 0, y: 0, screenSize: 0, isVisible: false };
        }

        // Project to screen using perspective projection
        const fov = (FOV * Math.PI) / 180;
        const scale = (SCREEN_WIDTH / 2) / Math.tan(fov / 2);

        const screenX = (rotatedX / finalZ) * scale + (SCREEN_WIDTH / 2);
        const screenY = -(rotatedY / finalZ) * scale + (SCREEN_HEIGHT / 2);

        // Calculate size based on distance
        const screenSize = (targetSize / finalZ) * scale;

        // Check if within FOV
        const isVisible =
            finalZ > 0.1 &&
            screenX >= -screenSize && screenX <= SCREEN_WIDTH + screenSize &&
            screenY >= -screenSize && screenY <= SCREEN_HEIGHT + screenSize;

        return { x: screenX, y: screenY, screenSize, isVisible };
    };

    return (
        <View className="flex-1">
            <CameraView>
                <Pressable className="absolute inset-0" onPress={handleMiss} />

                {targets.map((target) => {
                    const { x, y, screenSize, isVisible } = projectToScreen(
                        target.x,
                        target.y,
                        target.z,
                        target.size
                    );

                    if (!isVisible) return null;

                    return (
                        <Target
                            key={target.id}
                            id={target.id}
                            x={x}
                            y={y}
                            size={screenSize}
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
