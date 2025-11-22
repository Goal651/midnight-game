import { useState, useEffect, useRef } from 'react';
import { Gyroscope, Accelerometer } from 'expo-sensors';

interface Orientation {
    yaw: number;   // Rotation around vertical axis (left/right)
    pitch: number; // Rotation around horizontal axis (up/down)
    x: number;     // Position left/right (meters)
    y: number;     // Position up/down (meters)
    z: number;     // Position forward/back (meters)
}

export const useOrientation = () => {
    const [orientation, setOrientation] = useState<Orientation>({
        yaw: 0,
        pitch: 0,
        x: 0,
        y: 0,
        z: 0
    });

    // Rotation tracking (gyroscope)
    const yawRef = useRef(0);
    const pitchRef = useRef(0);
    const lastUpdateRef = useRef(Date.now());

    // Position tracking (accelerometer)
    const xRef = useRef(0);
    const yRef = useRef(0);
    const zRef = useRef(0);
    const vxRef = useRef(0); // Velocity X
    const vyRef = useRef(0); // Velocity Y
    const vzRef = useRef(0); // Velocity Z

    useEffect(() => {
        // Gyroscope for rotation
        Gyroscope.setUpdateInterval(16); // ~60fps

        const gyroSubscription = Gyroscope.addListener((data) => {
            const now = Date.now();
            const dt = (now - lastUpdateRef.current) / 1000;
            lastUpdateRef.current = now;

            // Integrate gyroscope data to get orientation
            yawRef.current += data.z * (180 / Math.PI) * dt;
            pitchRef.current += data.x * (180 / Math.PI) * dt;

            // Normalize yaw to 0-360
            while (yawRef.current >= 360) yawRef.current -= 360;
            while (yawRef.current < 0) yawRef.current += 360;

            // Clamp pitch to reasonable range
            pitchRef.current = Math.max(-90, Math.min(90, pitchRef.current));
        });

        // Accelerometer for position
        Accelerometer.setUpdateInterval(16);

        const accelSubscription = Accelerometer.addListener((data) => {
            const now = Date.now();
            const dt = (now - lastUpdateRef.current) / 1000;

            // Remove gravity (assuming phone is held portrait)
            // In portrait: -y is gravity direction
            const ax = data.x;
            const ay = data.y + 9.81; // Remove gravity
            const az = data.z;

            // Simple high-pass filter to reduce drift
            const threshold = 0.1; // Ignore small accelerations
            const filteredAx = Math.abs(ax) > threshold ? ax : 0;
            const filteredAy = Math.abs(ay) > threshold ? ay : 0;
            const filteredAz = Math.abs(az) > threshold ? az : 0;

            // Integrate acceleration to get velocity
            vxRef.current += filteredAx * dt;
            vyRef.current += filteredAy * dt;
            vzRef.current += filteredAz * dt;

            // Apply damping to reduce drift
            vxRef.current *= 0.98;
            vyRef.current *= 0.98;
            vzRef.current *= 0.98;

            // Integrate velocity to get position
            xRef.current += vxRef.current * dt;
            yRef.current += vyRef.current * dt;
            zRef.current += vzRef.current * dt;

            // Update state
            setOrientation({
                yaw: yawRef.current,
                pitch: pitchRef.current,
                x: xRef.current,
                y: yRef.current,
                z: zRef.current
            });
        });

        return () => {
            gyroSubscription.remove();
            accelSubscription.remove();
        };
    }, []);

    const resetPosition = () => {
        xRef.current = 0;
        yRef.current = 0;
        zRef.current = 0;
        vxRef.current = 0;
        vyRef.current = 0;
        vzRef.current = 0;
    };

    return { orientation, resetPosition };
};
