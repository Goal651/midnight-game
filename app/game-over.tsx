import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameOverScreen() {
    const router = useRouter();
    const { score } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
                style={styles.background}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>GAME OVER</Text>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>FINAL SCORE</Text>
                        <Text style={styles.scoreValue}>{score || 0}</Text>
                    </View>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.replace('/game')}
                    >
                        <Text style={styles.buttonText}>PLAY AGAIN</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>HOME</Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 4,
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    scoreContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 60,
        width: '80%',
    },
    scoreLabel: {
        color: '#rgba(255, 255, 255, 0.8)',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 2,
    },
    scoreValue: {
        color: '#fff',
        fontSize: 64,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5,
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#b21f1f',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#fff',
        shadowOpacity: 0,
        elevation: 0,
    },
    secondaryButtonText: {
        color: '#fff',
    },
});
