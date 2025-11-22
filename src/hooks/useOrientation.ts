import { useState, useEffect } from 'react';
import { DeviceMotion } from 'expo-sensors';

interface Orientation {
    yaw: number;
    pitch: number;
}

export const useOrientation = () => {
    const [orientation, setOrientation] = useState<Orientation>({ yaw: 0, pitch: 0 });
    const [initialOrientation, setInitialOrientation] = useState<Orientation | null>(null);

    useEffect(() => {
        // Set update interval to 16ms (approx 60fps)
        DeviceMotion.setUpdateInterval(16);

        const subscription = DeviceMotion.addListener((data) => {
            if (data.rotation) {
                // Convert radians to degrees
                // alpha is rotation around Z axis (yaw) - but in portrait mode, we care about beta/gamma differently
                // For simplicity in portrait AR:
                // alpha/gamma controls yaw (looking left/right)
                // beta controls pitch (looking up/down)

                // Note: DeviceMotion values depend on device orientation. 
                // Assuming portrait mode for now.

                const { alpha, beta, gamma } = data.rotation;

                // Simple mapping for proof of concept
                // alpha is 0 to 2pi
                const currentYaw = alpha * (180 / Math.PI);
                const currentPitch = beta * (180 / Math.PI);

                if (!initialOrientation) {
                    setInitialOrientation({ yaw: currentYaw, pitch: currentPitch });
                }

                setOrientation({ yaw: currentYaw, pitch: currentPitch });
            }
        });

        return () => subscription.remove();
    }, [initialOrientation]);

    return {
        orientation,
        initialOrientation: initialOrientation || { yaw: 0, pitch: 0 }
    };
};
