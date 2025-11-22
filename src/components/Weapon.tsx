import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withSpring,
    Easing
} from 'react-native-reanimated';

interface WeaponProps {
    isShooting: boolean;
}

export const Weapon: React.FC<WeaponProps> = ({ isShooting }) => {
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const flashOpacity = useSharedValue(0);

    useEffect(() => {
        if (isShooting) {
            // Recoil animation
            translateY.value = withSequence(
                withTiming(20, { duration: 50, easing: Easing.out(Easing.ease) }),
                withSpring(0, { damping: 10, stiffness: 100 })
            );

            rotate.value = withSequence(
                withTiming(-5, { duration: 50 }),
                withSpring(0)
            );

            // Muzzle flash
            flashOpacity.value = withSequence(
                withTiming(1, { duration: 20 }),
                withTiming(0, { duration: 100 })
            );
        }
    }, [isShooting, translateY, rotate, flashOpacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));

    const flashStyle = useAnimatedStyle(() => ({
        opacity: flashOpacity.value,
    }));

    return (
        <View className="absolute bottom-0 left-0 right-0 items-center justify-end h-[200px] pointer-events-none z-20" pointerEvents="none">
            {/* Muzzle Flash */}
            <Animated.View
                style={[flashStyle]}
                className="absolute bottom-[160px] w-[100px] h-[100px] bg-yellow-400 rounded-full blur-md z-30"
            />
            <Animated.View
                style={[flashStyle]}
                className="absolute bottom-[170px] w-[60px] h-[60px] bg-white rounded-full blur-sm z-30"
            />

            {/* Gun Model (Simple shapes for now) */}
            <Animated.View style={[animatedStyle]} className="items-center">
                {/* Barrel */}
                <View className="w-8 h-40 bg-gray-800 rounded-t-lg border-l-2 border-r-2 border-gray-600" />
                {/* Body */}
                <View className="w-16 h-24 bg-gray-900 -mt-10 rounded-lg border-2 border-gray-700" />
                {/* Grip detail */}
                <View className="w-12 h-20 bg-gray-800 absolute bottom-0 border-l border-r border-gray-600" />
            </Animated.View>
        </View>
    );
};
