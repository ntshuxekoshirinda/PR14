import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Select Your Path</Text>

      {/* Button Card 1: Links to workout.tsx with workout.png background */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/workout')}
      >
        <ImageBackground 
          source={require('../../assets/images/icon.png')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Hypertrophy Workout</Text>
            <Text style={styles.cardSubtitle}>Skinny-Fat Recomp Routine & Structured Exercises</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card 3: Abs Timer Circuit */}
<Pressable 
  style={styles.cardContainer} 
  onPress={() => router.push('/abs-circuit')}
>
  <View style={[styles.overlay, { flex: 1, justifyContent: 'flex-end' }]}>
    <Text style={styles.cardTitle}>Abs 60s Circuit Timer</Text>
    <Text style={styles.cardSubtitle}>6 Exercises • Automated 60-Second Countdown</Text>
  </View>
</Pressable>

      {/* Button Card 2: Links to allworkouts.tsx with allworkouts.png background */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/allworkouts')}
      >
        <ImageBackground 
          source={require('../../assets/images/icon.png')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>All Workouts Database</Text>
            <Text style={styles.cardSubtitle}>Browse All Exercises by Muscle Category</Text>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#e9ecef',
  },
});