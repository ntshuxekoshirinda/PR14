import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { getDb } from '../services/dbService';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const exerciseId = Array.isArray(id) ? id[0] : id;

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  useEffect(() => {
    async function fetchExerciseDetails() {
      if (!exerciseId) return;
      try {
        const db = await getDb();
        const result = await db.getFirstAsync<any>(
          'SELECT * FROM exercises WHERE id = ?',
          [exerciseId]
        );
        setExercise(result);
      } catch (e) {
        console.error("Failed to fetch exercise details:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchExerciseDetails();
  }, [exerciseId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Exercise not found.</Text>
      </View>
    );
  }

  const gifUrl = `${BASE_URL}${exercise.gif_url}`;

  // Safely parse secondary_muscles (expected format: string[] or JSON string array)
  let secondaryMusclesList: string[] = [];
  try {
    const rawSec = exercise.secondary_muscles;
    if (typeof rawSec === 'string') {
      const parsed = JSON.parse(rawSec);
      if (Array.isArray(parsed)) {
        secondaryMusclesList = parsed;
      }
    } else if (Array.isArray(rawSec)) {
      secondaryMusclesList = rawSec;
    }
  } catch (e) {
    if (typeof exercise.secondary_muscles === 'string') {
      secondaryMusclesList = exercise.secondary_muscles.split(',').map((s: string) => s.trim());
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Exercise Animated GIF Banner */}
      <Image
        source={{ uri: gifUrl }}
        style={styles.gifImage}
        contentFit="contain"
        transition={200}
      />

      <View style={styles.detailsContainer}>
        {/* Title */}
        <Text style={styles.title}>{exercise.name}</Text>

        {/* Tags Row (Target, Equipment, and Secondary Muscles) */}
        <View style={styles.tagRow}>
          {exercise.target && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Target: {exercise.target}</Text>
            </View>
          )}

          {exercise.equipment && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Equipment: {exercise.equipment}</Text>
            </View>
          )}

          {secondaryMusclesList.map((muscle, index) => (
            <View key={index} style={[styles.tag, styles.secondaryTag]}>
              <Text style={styles.tagText}>Secondary: {muscle}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  secondaryTag: {
    backgroundColor: '#e9ecef', // Slightly distinct tint for secondary muscles
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textTransform: 'capitalize',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});