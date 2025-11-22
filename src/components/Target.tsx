
import React, { useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

interface TargetProps {
    id: string;
    x: number; // Screen X
    y: number; // Screen Y
    size: number;
    color: string;
    onHit: (id: string) => void;
}

export const Target: React.FC<TargetProps> = ({ id, x, y, size, color, onHit }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 90 });
    }, []);

    const handlePress = () => {
        scale.value = withTiming(1.5, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(onHit)(id);
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    // Don't render if off screen
    if (x < -size || x > Dimensions.get('window').width + size ||
        y < -size || y > Dimensions.get('window').height + size) {
        return null;
    }

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                },
                animatedStyle,
            ]}
        >
            <Pressable
                onPress={handlePress}
                className="w-full h-full rounded-full justify-center items-center"
            >
                <View className="w-[30px] h-[30px] rounded-full bg-white/50" />
            </Pressable>
        </Animated.View>
    );
};
