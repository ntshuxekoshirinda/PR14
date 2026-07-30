import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getDb } from '../services/dbService';
import { ExerciseMain } from '../components/ExerciseMain';

export default function WorkoutPlanScreen() {
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  useEffect(() => {
    async function fetchRoutineExercises() {
      try {
        const db = await getDb();
        // Fetch a mix of abs and triceps exercises for a skinny-fat recomp routine
        const results = await db.getAllAsync<any>(
          "SELECT * FROM exercises WHERE LOWER(target) IN ('abs', 'triceps', 'pectorals', 'lats') LIMIT 16"
        );
        setWorkoutExercises(results);
      } catch (e) {
        console.error("Failed to load workout routine:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchRoutineExercises();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Routine Header */}
      <View style={styles.headerCard}>
        <Text style={styles.routineTitle}>Hypertrophy Recomp Routine</Text>
        <Text style={styles.routineSubtitle}>
          Designed for a skinny-fat profile: Focuses on core stability, progressive overload, and lean muscle building. Perform 3–4 sets of 8–12 reps per exercise.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Today's Target Exercises</Text>

      {/* Exercise List */}
      {workoutExercises.map((item) => {
        const gifUrl = `${BASE_URL}${item.gif_url}`;
        return (
          <View key={item.id} style={styles.cardWrapper}>
            <ExerciseMain
              title={item.name}
              imageSource={{ uri: gifUrl }}
              onPress={() => router.push({ 
                pathname: '/exercise', 
                params: { id: item.id } 
              })}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#7CB342',
  },
  routineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  routineSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 12,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});