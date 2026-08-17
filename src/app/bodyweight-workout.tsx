import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { getDb } from '../services/dbService';

export default function WorkoutPlanScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [bodyweightExercises, setBodyweightExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  // Fetch both routines daily using calendar reference and filtering equipment for body weight
  useEffect(() => {
    async function fetchDailyRoutineExercises() {
      try {
        const db = await getDb();
        
        // Standard hypertrophic routine (10 exercises)
        const results = await db.getAllAsync<any>(
          `SELECT * FROM exercises WHERE LOWER(target) IN ('abs', 'triceps', 'pectorals', 'lats') ORDER BY RANDOM() LIMIT 10`
        );
        setExercises(results);

        // Hypertrophy body weight routine (filtered specifically for body weight equipment)
        const bwResults = await db.getAllAsync<any>(
          `SELECT * FROM exercises WHERE LOWER(equipment) LIKE '%body weight%' AND LOWER(target) IN ('abs', 'triceps', 'pectorals', 'lats') ORDER BY RANDOM() LIMIT 10`
        );
        setBodyweightExercises(bwResults);

        if (results.length > 0) {
          setIsActive(true);
        }
      } catch (e) {
        console.error("Failed to load daily workout routines:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDailyRoutineExercises();
  }, []);

  // Speak exercise name, rep target, and instructions when current exercise changes
  useEffect(() => {
    if (exercises.length > 0 && exercises[currentIndex]) {
      const currentEx = exercises[currentIndex];
      const exerciseName = currentEx.name;
      const instructionsText = currentEx.instructions_en ? ` Instructions: ${currentEx.instructions_en}` : '';

      Speech.stop();
      Speech.speak(`Next exercise: ${exerciseName}. Target: 20 reps within 120 seconds.${instructionsText}`, {
        language: 'en',
        rate: 0.95,
      });
    }
  }, [currentIndex, exercises]);

  // 120-second countdown timer effect with voice cues
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
              Speech.speak("Workout complete. Great job on your daily routine!", { rate: 1.0 });
              return 0;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentIndex, completed, exercises]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.completedTitle}>Workout Complete! 🎉</Text>
        <Text style={styles.completedSubtitle}>You crushed all exercises for today's routines.</Text>
        <Pressable style={styles.button} onPress={() => { Speech.stop(); router.back(); }}>
          <Text style={styles.buttonText}>Return Home</Text>
        </Pressable>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex] || {};
  const gifUrl = `${BASE_URL}${currentExercise.gif_url}`;

  return (
    <View style={styles.container}>
      {/* SECTION 1: Standard Hypertrophy Workout */}
      <View style={styles.sectionContainer}>
        <Text style={styles.mainSectionHeader}>Hypertrophy Workout</Text>

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
              <Text style={styles.targetBadgeValue}>20</Text>
              <Text style={styles.targetBadgeLabel}>Target Reps</Text>
            </View>
            <View style={styles.targetBadgeDivider} />
            <View style={styles.targetBadge}>
              <Text style={styles.targetBadgeValue}>120s</Text>
              <Text style={styles.targetBadgeLabel}>Time Cap</Text>
            </View>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
          <Text style={styles.timerSubText}>Time Remaining</Text>
        </View>

        <View style={styles.controlsRow}>
          <Pressable 
            style={[styles.controlButton, { backgroundColor: isActive ? '#f0ad4e' : '#7CB342' }]} 
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
      </View>

      {/* SECTION 2: Hypertrophy Body Weight Workout */}
      <View style={[styles.sectionContainer, styles.bodyweightSection]}>
        <Text style={styles.mainSectionHeader}>Hypertrophy Body Weight Workout</Text>
        <Text style={styles.sectionDescription}>
          Zero equipment required. Focuses exclusively on body-weight compound and isolation movements for lean muscle growth.
        </Text>
        
        {bodyweightExercises.length > 0 ? (
          bodyweightExercises.map((bwItem, idx) => {
            const bwGifUrl = `${BASE_URL}${bwItem.gif_url}`;
            return (
              <View key={bwItem.id || idx} style={styles.bwCard}>
                <Image
                  source={{ uri: bwGifUrl }}
                  style={styles.bwGifImage}
                  contentFit="contain"
                  transition={200}
                />
                <View style={styles.bwCardContent}>
                  <Text style={styles.bwExerciseName}>{bwItem.name}</Text>
                  <Text style={styles.bwTargetText}>Target: 20 Reps / 120s Cap</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noBwText}>No body weight exercises found for today.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  bodyweightSection: {
    borderTopWidth: 2,
    borderTopColor: '#e9ecef',
    paddingTop: 20,
  },
  mainSectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
    lineHeight: 20,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
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
    marginBottom: 15,
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
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7CB342',
  },
  timerSubText: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  bwCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  bwGifImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f1f3f5',
    marginRight: 12,
  },
  bwCardContent: {
    flex: 1,
  },
  bwExerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  bwTargetText: {
    fontSize: 13,
    color: '#7CB342',
    fontWeight: '600',
  },
  noBwText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
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
    backgroundColor: '#7CB342',
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