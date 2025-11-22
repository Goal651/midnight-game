import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

interface CameraViewProps {
    children?: React.ReactNode;
}

export const CameraView: React.FC<CameraViewProps> = ({ children }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    React.useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    if (!hasPermission) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white text-lg text-center mt-24">Camera permission required</Text>
            </View>
        );
    }

    if (!device) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white text-lg text-center mt-24">No camera device found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
            {/* Overlay for targets and UI */}
            <View className="absolute inset-0">
                {children}
            </View>
        </View>
    );
};
