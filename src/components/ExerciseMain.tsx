import React from 'react';
import { Pressable, ImageBackground, Text, StyleSheet, ViewStyle } from "react-native";
import { Image } from 'expo-image';

interface ExerciseMainProps {
    title: string;
    imageSource: any;
    onPress: () => void;
    style?: ViewStyle;
}
export function ExerciseMain({title, imageSource, onPress, style }: ExerciseMainProps){
    return (
        <Pressable onPress={onPress} style={[styles.buttonWrapper, style]}>
            <Image 
  source={imageSource} 
  style={{ width: '100%', height: '100%' }} // Ensure your container has size
  contentFit="cover" // equivalent to resizeMode: 'cover'
  transition={200} // Smooth fade-in
/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        height: 150,
        width: '100%',
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden'
    },

    imageBackground: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageStyle: {
        borderRadius: 15,
    },

    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1},
        textShadowRadius: 3,
    },
});