import { useState, useEffect, useRef } from 'react';
import { Gyroscope } from 'expo-sensors';

interface Orientation {
    yaw: number;   // Rotation around vertical axis (left/right)
    pitch: number; // Rotation around horizontal axis (up/down)
}

export const useOrientation = () => {
    const [orientation, setOrientation] = useState<Orientation>({ yaw: 0, pitch: 0 });
    const yawRef = useRef(0);
    const pitchRef = useRef(0);
    const lastUpdateRef = useRef(Date.now());

    useEffect(() => {
        Gyroscope.setUpdateInterval(16); // ~60fps

        const subscription = Gyroscope.addListener((data) => {
            const now = Date.now();
            const dt = (now - lastUpdateRef.current) / 1000; // Convert to seconds
            lastUpdateRef.current = now;

            // Integrate gyroscope data to get orientation
            // For portrait mode on Android:

            // data.z = rotation around Z axis (yaw - left/right)
            // data.x = rotation around X axis (pitch - up/down)

            // Convert rad/s to degrees and integrate
            yawRef.current += data.z * (180 / Math.PI) * dt;
            pitchRef.current += data.x * (180 / Math.PI) * dt;

            // Normalize yaw to 0-360
            while (yawRef.current >= 360) yawRef.current -= 360;
            while (yawRef.current < 0) yawRef.current += 360;

            // Clamp pitch to reasonable range
            pitchRef.current = Math.max(-90, Math.min(90, pitchRef.current));

            setOrientation({
                yaw: yawRef.current,
                pitch: pitchRef.current
            });
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return { orientation };
};
