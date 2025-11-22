import React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>MIDNIGHT</Text>
          <Text style={styles.subtitle}>AR SHOOTING GALLERY</Text>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>🎯 Find targets in your room</Text>
            <Text style={styles.instructionText}>🔫 Tap to shoot them</Text>
            <Text style={styles.instructionText}>⏱️ You have 30 seconds</Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => router.push('/game')}
          >
            <Text style={styles.buttonText}>START GAME</Text>
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
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    letterSpacing: 2,
    marginBottom: 60,
  },
  instructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 60,
    width: '100%',
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
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
  },
  buttonText: {
    color: '#b21f1f',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
