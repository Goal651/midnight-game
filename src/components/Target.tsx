import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';

interface TargetProps {
    id: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    color: string;
    onHit: (id: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TARGET_SIZE = 80;

export const Target: React.FC<TargetProps> = ({ id, x, y, color, onHit }) => {
    // Animated values for movement
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    // Start floating animation
    React.useEffect(() => {
        // Gentle floating movement
        translateX.value = withRepeat(
            withSequence(
                withTiming(20, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        translateY.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(15, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Pulse animation
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        );
    }, [translateX, translateY, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const handlePress = () => {
        onHit(id);
    };

    // Convert percentage to actual position
    const leftPosition = (x / 100) * SCREEN_WIDTH - TARGET_SIZE / 2;
    const topPosition = (y / 100) * SCREEN_HEIGHT - TARGET_SIZE / 2;

    return (
        <Animated.View
            style={[
                styles.target,
                {
                    left: leftPosition,
                    top: topPosition,
                    backgroundColor: color,
                },
                animatedStyle,
            ]}
        >
            <Pressable
                onPress={handlePress}
                style={styles.pressable}
            >
                <View style={styles.innerCircle} />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    target: {
        position: 'absolute',
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        borderRadius: TARGET_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    pressable: {
        width: '100%',
        height: '100%',
        borderRadius: TARGET_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});
