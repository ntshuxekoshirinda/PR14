import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { getDb } from '../services/dbService';

export default function AbsCircuitScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  // Fetch 6 abs exercises on mount
  useEffect(() => {
    async function fetchAbsExercises() {
      try {
        const db = await getDb();
        const results = await db.getAllAsync<any>(
          "SELECT * FROM exercises WHERE LOWER(target) LIKE '%abs%' LIMIT 6"
        );
        setExercises(results);
        if (results.length > 0) {
          setIsActive(true); // Automatically start timer when loaded
        }
      } catch (e) {
        console.error("Failed to load abs circuit exercises:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAbsExercises();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && !completed && exercises.length > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Time's up for current exercise, jump to next or complete
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex((idx) => idx + 1);
              return 60; // Reset clock to 60 seconds
            } else {
              setIsActive(false);
              setCompleted(true);
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

  if (exercises.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No abs exercises found in the database.</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.completedTitle}>Circuit Complete! 🎉</Text>
        <Text style={styles.completedSubtitle}>You crushed all 6 abs exercises.</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Return Home</Text>
        </Pressable>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex];
  const gifUrl = `${BASE_URL}${currentExercise.gif_url}`;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Exercise {currentIndex + 1} of {exercises.length}
        </Text>
      </View>

      {/* Exercise Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: gifUrl }}
          style={styles.gifImage}
          contentFit="contain"
          transition={200}
        />
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
      </View>

      {/* Clock Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
        <Text style={styles.timerSubText}>Remaining</Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsRow}>
        <Pressable 
          style={[styles.controlButton, { backgroundColor: isActive ? '#f0ad4e' : '#7CB342' }]} 
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.controlButtonText}>{isActive ? 'Pause' : 'Resume'}</Text>
        </Pressable>

        <Pressable 
          style={[styles.controlButton, { backgroundColor: '#6c757d' }]} 
          onPress={() => {
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setTimeLeft(60);
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  progressHeader: {
    alignItems: 'center',
    marginTop: 10,
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
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gifImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f1f3f5',
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#7CB342',
  },
  timerSubText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});