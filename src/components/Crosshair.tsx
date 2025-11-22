import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export const Crosshair = () => {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View style={[styles.crosshair, animatedStyle]}>
                <View style={styles.horizontal} />
                <View style={styles.vertical} />
                <View style={styles.center} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    crosshair: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontal: {
        position: 'absolute',
        width: 20,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    vertical: {
        position: 'absolute',
        width: 2,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    center: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF6B6B',
    },
});
