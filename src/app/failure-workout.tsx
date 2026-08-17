import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { getDb } from '../services/dbService';

// Map regular names to biological database targets and unique theme colors, including Chest
const MUSCLE_GROUPS: Record<string, { dbTargets: string, color: string }> = {
  'Chest': { dbTargets: "'pectorals'", color: '#ff7043' }, // Orange
  'Back': { dbTargets: "'lats', 'upper back', 'spine'", color: '#42a5f5' }, // Blue
  'Legs': { dbTargets: "'quads', 'glutes', 'hamstrings', 'calves'", color: '#ab47bc' }, // Purple
  'Shoulders': { dbTargets: "'delts', 'traps'", color: '#ef5350' }, // Red
  'Arms': { dbTargets: "'biceps', 'triceps', 'forearms'", color: '#26a69a' }, // Teal
  'Core': { dbTargets: "'abs'", color: '#fbc02d' }, // Gold
};

export default function FailureWorkoutScreen() {
  const { group } = useLocalSearchParams<{ group: string }>();
  
  const safeGroup = group && MUSCLE_GROUPS[group] ? group : 'Chest'; 
  const { dbTargets, color: themeColor } = MUSCLE_GROUPS[safeGroup];

  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  useEffect(() => {
    async function fetchDynamicRoutine() {
      try {
        const db = await getDb();
        const results = await db.getAllAsync<any>(
          `SELECT * FROM exercises WHERE LOWER(target) IN (${dbTargets}) ORDER BY RANDOM()`
        );
        setExercises(results);
        if (results.length > 0) {
          setIsActive(true);
        }
      } catch (e) {
        console.error(`Failed to load ${safeGroup} workout routine:`, e);
      } finally {
        setLoading(false);
      }
    }
    fetchDynamicRoutine();
  }, [dbTargets]);

  useEffect(() => {
    if (exercises.length > 0 && exercises[currentIndex]) {
      const currentEx = exercises[currentIndex];
      const exerciseName = currentEx.name;
      const instructionsText = currentEx.instructions_en ? ` Instructions: ${currentEx.instructions_en}` : '';

      Speech.stop();
      Speech.speak(`Next ${safeGroup.toLowerCase()} exercise: ${exerciseName}. Objective: Train to failure within 120 seconds.${instructionsText}`, {
        language: 'en',
        rate: 0.95,
      });
    }
  }, [currentIndex, exercises, safeGroup]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && !completed && exercises.length > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 11) {
            Speech.speak("10 seconds remaining", { rate: 1.1 });
          }

          if (prev > 1) {
            return prev - 1;
          } else {
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex((idx) => idx + 1);
              return 120;
            } else {
              setIsActive(false);
              setCompleted(true);
              Speech.speak(`Workout complete. Incredible job pushing your ${safeGroup.toLowerCase()} to failure!`, { rate: 1.0 });
              return 0;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentIndex, completed, exercises, safeGroup]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  if (completed) {
    return (
      <ScrollView contentContainerStyle={styles.centerContainer}>
        <Text style={styles.completedTitle}>{safeGroup} Workout Complete! 🔥</Text>
        <Text style={styles.completedSubtitle}>You pushed all {safeGroup.toLowerCase()} exercises to failure today.</Text>
        <Pressable style={[styles.button, { backgroundColor: themeColor }]} onPress={() => { Speech.stop(); router.back(); }}>
          <Text style={styles.buttonText}>Return Home</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const currentExercise = exercises[currentIndex] || {};
  const gifUrl = `${BASE_URL}${currentExercise.gif_url}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Exercise {currentIndex + 1} of {exercises.length}
        </Text>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: gifUrl }}
          style={styles.gifImage}
          contentFit="contain"
          transition={200}
        />
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        
        <View style={styles.targetBadgeRow}>
          <View style={styles.targetBadge}>
            <Text style={styles.targetBadgeValue}>Failure</Text>
            <Text style={styles.targetBadgeLabel}>Objective</Text>
          </View>
          <View style={styles.targetBadgeDivider} />
          <View style={styles.targetBadge}>
            <Text style={styles.targetBadgeValue}>120s</Text>
            <Text style={styles.targetBadgeLabel}>Time Cap</Text>
          </View>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: themeColor }]}>{timeLeft}s</Text>
        <Text style={styles.timerSubText}>Time Remaining</Text>
      </View>

      <View style={styles.controlsRow}>
        <Pressable 
          style={[styles.controlButton, { backgroundColor: isActive ? '#f0ad4e' : themeColor }]} 
          onPress={() => {
            setIsActive(!isActive);
            if (!isActive) {
              Speech.speak("Resumed");
            } else {
                Speech.stop(); 
                Speech.speak("Paused");
            }
          }}
        >
          <Text style={styles.controlButtonText}>{isActive ? 'Pause' : 'Resume'}</Text>
        </Pressable>

        <Pressable 
          style={[styles.controlButton, { backgroundColor: '#6c757d' }]} 
          onPress={() => {
            Speech.stop();
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setTimeLeft(120);
            } else {
              setCompleted(true);
              setIsActive(false);
            }
          }}
        >
          <Text style={styles.controlButtonText}>Skip</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  progressHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6c757d',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  gifImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f1f3f5',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  targetBadgeRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  targetBadge: {
    alignItems: 'center',
  },
  targetBadgeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  targetBadgeLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  targetBadgeDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#dee2e6',
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  timerSubText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 25,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});