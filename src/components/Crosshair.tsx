import React, { useEffect } from 'react';
import { View } from 'react-native';
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
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View className="absolute inset-0 justify-center items-center z-10" pointerEvents="none">
            <Animated.View style={[animatedStyle, { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
                <View className="absolute w-5 h-0.5 bg-white/80" />
                <View className="absolute w-0.5 h-5 bg-white/80" />
                <View className="w-1 h-1 rounded-full bg-[#FF6B6B]" />
            </Animated.View>
        </View>
    );
};
