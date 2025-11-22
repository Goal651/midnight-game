import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameOverScreen() {
    const { score } = useLocalSearchParams();

    return (
        <View className="flex-1">
            <LinearGradient
                colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
                className="flex-1 justify-center items-center"
            >
                <View className="items-center p-5 w-full">
                    <Text className="text-5xl font-bold text-white tracking-[4px] mb-10 shadow-lg shadow-black/75">GAME OVER</Text>

                    <View className="bg-black/30 p-8 rounded-3xl items-center mb-16 w-4/5">
                        <Text className="text-white/80 text-lg font-bold mb-2.5 tracking-widest">FINAL SCORE</Text>
                        <Text className="text-white text-6xl font-bold shadow-md shadow-black/50">{score || 0}</Text>
                    </View>

                    <Pressable
                        className="bg-white px-10 py-5 rounded-[30px] shadow-md shadow-black/30 elevation-5 w-4/5 items-center mb-5"
                        onPress={() => router.replace('/game')}
                    >
                        <Text className="text-[#b21f1f] text-xl font-bold tracking-widest">PLAY AGAIN</Text>
                    </Pressable>

                    <Pressable
                        className="bg-transparent border-2 border-white px-10 py-5 rounded-[30px] w-4/5 items-center"
                        onPress={() => router.replace('/')}
                    >
                        <Text className="text-white text-xl font-bold tracking-widest">HOME</Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </View>
    );
}
