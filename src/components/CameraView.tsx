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
            <View style={styles.container}>
                <Text style={styles.permissionText}>Camera permission required</Text>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>No camera device found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
            {/* Overlay for targets and UI */}
            <View style={styles.overlay}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
});
