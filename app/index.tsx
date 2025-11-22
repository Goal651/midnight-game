import React from 'react';
import { View, Text, Pressable } from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        className="flex-1 justify-center items-center"
      >
        <View className="items-center p-5">
          <Text className="text-5xl font-bold text-white mb-2.5 tracking-[4px] shadow-lg shadow-black/75">MIDNIGHT</Text>
          <Text className="text-lg text-white/90 tracking-[2px] mb-16">AR SHOOTING GALLERY</Text>

          <View className="bg-black/30 p-5 rounded-2xl mb-16 w-full">
            <Text className="text-white text-lg mb-2.5 text-center">🎯 Find targets in your room</Text>
            <Text className="text-white text-lg mb-2.5 text-center">🔫 Tap to shoot them</Text>
            <Text className="text-white text-lg mb-2.5 text-center">⏱️ You have 30 seconds</Text>
          </View>

          <Pressable
            className="bg-white px-10 py-5 rounded-[30px] shadow-md shadow-black/30 elevation-5"
            onPress={() => router.push('/game')}
          >
            <Text className="text-[#b21f1f] text-xl font-bold tracking-widest">START GAME</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}
