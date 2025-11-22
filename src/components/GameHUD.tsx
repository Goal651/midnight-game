import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameHUDProps {
    score: number;
    timeRemaining: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ score, timeRemaining }) => {
    return (
        <View style={styles.container}>
            <View style={styles.statBox}>
                <Text style={styles.label}>SCORE</Text>
                <Text style={styles.value}>{score}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={styles.label}>TIME</Text>
                <Text style={[styles.value, timeRemaining <= 5 && styles.warningText]}>
                    {timeRemaining}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 100,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    label: {
        color: '#rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    value: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    warningText: {
        color: '#FF6B6B',
    },
});
