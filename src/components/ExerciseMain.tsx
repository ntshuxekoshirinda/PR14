import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';

interface ExerciseMainProps {
  title: string;
  imageSource: { uri: string };
  onPress: () => void;
}

const THUMBNAIL_SIZE = 70;

export const ExerciseMain: React.FC<ExerciseMainProps> = ({ title, imageSource, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <View style={styles.contentRow}>
        {/* Animated GIF thumbnail */}
        <Image
          source={imageSource}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        
        {/* Exercise name */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  checkmarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});