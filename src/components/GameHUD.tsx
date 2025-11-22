import React from 'react';
import { View, Text } from 'react-native';

interface GameHUDProps {
    score: number;
    timeRemaining: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ score, timeRemaining }) => {
    return (
        <View className="absolute top-[60px] left-5 right-5 flex-row justify-between">
            <View className="bg-black/60 px-5 py-2.5 rounded-2xl items-center min-w-[100px] border border-white/20">
                <Text className="text-white/70 text-xs font-bold mb-0.5">SCORE</Text>
                <Text className="text-white text-3xl font-bold">{score}</Text>
            </View>

            <View className="bg-black/60 px-5 py-2.5 rounded-2xl items-center min-w-[100px] border border-white/20">
                <Text className="text-white/70 text-xs font-bold mb-0.5">TIME</Text>
                <Text className={`text-white text-3xl font-bold ${timeRemaining <= 5 ? 'text-[#FF6B6B]' : ''}`}>
                    {timeRemaining}
                </Text>
            </View>
        </View>
    );
};
